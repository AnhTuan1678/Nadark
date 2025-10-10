const db = require('../models')
const { Op, literal } = require('sequelize')

exports.getAllBooks = async ({ limit, offset }) => {
  const count = await db.Book.count()

  const rows = await db.Book.findAll({
    limit: limit || 30,
    offset: offset || 0,
    order: [['updated_at', 'DESC']],
    include: [
      {
        model: db.Genre,
        through: { attributes: [] },
        attributes: ['id', 'name', 'description'],
      },
    ],
  })

  return {
    total: count,
    data: rows,
  }
}

exports.searchBooks = async (
  query,
  limit = 8,
  genres = [],
  minChapter = 0,
  maxChapter = 1e6,
) => {
  const similarityThreshold = query.length < 4 ? 0.1 : 0.25

  // Điều kiện cơ bản
  const whereCondition = {
    [Op.or]: [
      { title: { [Op.iLike]: `%${query}%` } },
      { author: { [Op.iLike]: `%${query}%` } },
    ],
    chapter_count: { [Op.between]: [minChapter, maxChapter] },
  }

  // Lấy ID sách phù hợp thể loại (nếu có lọc)
  let bookIds = null
  if (genres.length > 0) {
    const booksWithGenre = await db.Book.findAll({
      attributes: ['id'],
      include: [
        {
          model: db.Genre,
          where: { id: { [Op.in]: genres } },
          attributes: [],
          through: { attributes: [] },
        },
      ],
    })
    bookIds = booksWithGenre.map((b) => b.id)
    if (!bookIds.length) return [] // không có sách phù hợp
    whereCondition.id = { [Op.in]: bookIds }
  }

  // Truy vấn exact match (với include genre đầy đủ)
  const exactResults = await db.Book.findAll({
    include: [
      {
        model: db.Genre,
        attributes: ['id', 'name', 'description'],
        through: { attributes: [] },
      },
    ],
    where: whereCondition,
    limit,
    order: [
      [
        literal(`CASE 
          WHEN "title" ILIKE '${query}%' THEN 0
          WHEN "author" ILIKE '${query}%' THEN 1
          ELSE 2
        END`),
        'ASC',
      ],
    ],
  })

  // Similarity search
  let similarityResults = []
  if (exactResults.length < limit) {
    const exactIds = exactResults.map((r) => r.id)
    similarityResults = await db.Book.findAll({
      attributes: {
        include: [
          [
            literal(
              `GREATEST(similarity("title", '${query}'), similarity("author", '${query}'))`,
            ),
            'sim_score',
          ],
        ],
      },
      include: [
        {
          model: db.Genre,
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] },
        },
      ],
      where: literal(
        `GREATEST(similarity("title", '${query}'), similarity("author", '${query}')) >= ${similarityThreshold}` +
          ` AND "chapter_count" BETWEEN ${minChapter} AND ${maxChapter}` +
          (bookIds ? ` AND id IN (${bookIds.join(',')})` : '') +
          (exactIds.length ? ` AND id NOT IN (${exactIds.join(',')})` : ''),
      ),
      order: [[literal('sim_score'), 'DESC']],
      limit: limit - exactResults.length,
    })
  }

  // Kết quả cuối
  const results = [...exactResults, ...similarityResults]

  return results
}

exports.getBookById = async (id) => {
  const book = await db.Book.findByPk(id, {
    include: [
      {
        model: db.Genre,
        through: { attributes: [] },
        attributes: ['name'],
      },
    ],
  })
  if (!book) return null
  await book.increment('views', { by: 1 })

  return book
}

exports.getChaptersByBookId = async (bookId) => {
  return db.Chapter.findAll({
    where: { book_id: bookId },
    order: [['id', 'ASC']],
  })
}

exports.getChapterByIndex = async (bookId, index) => {
  return db.Chapter.findOne({
    where: { book_id: bookId },
    order: [['id', 'ASC']],
    offset: index - 1,
    limit: 1,
  })
}

exports.createReview = async (userId, { book_id, content, rating }) => {
  const book = await db.Book.findByPk(book_id)
  if (!book) throw new Error('BOOK_NOT_FOUND')

  const existing = await db.Review.findOne({
    where: { book_id, user_id: userId },
  })
  if (existing) throw new Error('ALREADY_REVIEWED')

  return db.Review.create({ user_id: userId, book_id, content, rating })
}

exports.getReviews = async (bookId) => {
  return db.Review.findAll({
    where: { book_id: bookId },
    include: [{ model: db.User, attributes: ['id', 'username', 'avatar_url'] }],
    order: [['created_at', 'DESC']],
  })
}

exports.updateReview = async (userId, reviewId, { content, rating }) => {
  const review = await db.Review.findByPk(reviewId)
  if (!review) throw new Error('REVIEW_NOT_FOUND')
  if (review.user_id !== userId) throw new Error('FORBIDDEN')

  review.content = content || review.content
  review.rating = rating || review.rating
  review.updated_at = new Date()

  return review.save()
}

exports.deleteReview = async (userId, reviewId) => {
  const review = await db.Review.findByPk(reviewId)
  if (!review) throw new Error('REVIEW_NOT_FOUND')
  if (review.user_id !== userId) throw new Error('FORBIDDEN')

  await review.destroy()
  return true
}

exports.createBook = async (bookData, uploaderId = null) => {
  const {
    title,
    author,
    description,
    status,
    genres = [],
    url_avatar,
  } = bookData

  // Kiểm tra trùng tên sách + tác giả
  // const existing = await db.Book.findOne({
  //   where: { title, author },
  // })
  // if (existing) throw new Error('BOOK_ALREADY_EXISTS')

  // Tạo sách mới
  const newBook = await db.Book.create({
    title,
    author,
    description,
    status: status || 'Đang ra',
    url_avatar: url_avatar || 'https://docln.net/img/nocover.jpg',
    uploader_id: uploaderId, // có thể null
    created_at: new Date(),
    updated_at: new Date(),
  })

  // Gắn thể loại (nếu có)
  if (Array.isArray(genres) && genres.length > 0) {
    const genreRecords = await db.Genre.findAll({
      where: { id: genres },
    })
    await newBook.setGenres(genreRecords)
  }

  // Trả lại sách vừa tạo kèm thể loại
  const createdBook = await db.Book.findByPk(newBook.id, {
    include: [
      {
        model: db.Genre,
        attributes: ['id', 'name', 'description'],
        through: { attributes: [] },
      },
    ],
  })

  return createdBook
}
