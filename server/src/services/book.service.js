const db = require('../models')
const { Op, literal } = require('sequelize')

exports.getAllBooks = async ({ limit, offset }) => {
  const { count, rows } = await db.Book.findAndCountAll({
    limit: limit || 30,
    offset: offset || 0,
    order: [['updated_at', 'DESC']], // sắp xếp theo thời gian cập nhật
  })
  return {
    total: count,
    data: rows,
  }
}

exports.searchBooks = async (query) => {
  if (!query.trim()) return []

  const limit = 8
  const similarityThreshold = 0.2 // độ giống tối thiểu

  // 1. Tìm bản ghi chứa query
  let results = await db.Book.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${query}%` } },
        { author: { [Op.iLike]: `%${query}%` } },
      ],
    },
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

  // 2. Nếu không có kết quả chứa query → dùng similarity
  if (results.length < limit) {
    results = await db.Book.findAll({
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
      where: literal(
        `GREATEST(similarity("title", '${query}'), similarity("author", '${query}')) >= ${similarityThreshold}`,
      ),
      order: [[literal('sim_score'), 'DESC']],
      limit,
    })
  }

  return results
}

exports.getBookById = async (id) => {
  const book = await db.Book.findByPk(id)
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
