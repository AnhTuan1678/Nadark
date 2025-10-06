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

// exports.searchBooks = async (query, limit = 8) => {
//   if (!query.trim()) return []

//   const similarityThreshold = query.length < 4 ? 0.1 : 0.35
//   const startTime = performance.now()

//   // 1️⃣ Tìm exact match
//   let exactResults = await db.Book.findAll({
//     where: {
//       [Op.or]: [
//         { title: { [Op.iLike]: `%${query}%` } },
//         { author: { [Op.iLike]: `%${query}%` } },
//       ],
//     },
//     limit,
//     order: [
//       [
//         literal(`CASE
//           WHEN "title" ILIKE '${query}%' THEN 0
//           WHEN "author" ILIKE '${query}%' THEN 1
//           ELSE 2
//         END`),
//         'ASC',
//       ],
//     ],
//   })

//   // 2️⃣ Chỉ search similarity nếu exactResults chưa đủ limit
//   let similarityResults = []
//   if (exactResults.length < limit) {
//     const exactIds = exactResults.map((r) => r.id)
//     similarityResults = await db.Book.findAll({
//       attributes: {
//         include: [
//           [
//             literal(
//               `GREATEST(similarity("title", '${query}'), similarity("author", '${query}'))`,
//             ),
//             'sim_score',
//           ],
//         ],
//       },
//       where: literal(
//         `GREATEST(similarity("title", '${query}'), similarity("author", '${query}')) >= ${similarityThreshold}` +
//           (exactIds.length ? ` AND id NOT IN (${exactIds.join(',')})` : ''),
//       ),
//       order: [[literal('sim_score'), 'DESC']],
//       limit: limit - exactResults.length,
//     })
//   }

//   // 3️⃣ Gộp kết quả
//   const results = [...exactResults, ...similarityResults]

//   const endTime = performance.now()
//   const searchTime = (endTime - startTime).toFixed(2)
//   console.log(
//     `🔍 Search "${query}" mất ${searchTime} ms, kết quả: ${results.length}`,
//   )

//   return results
// }

exports.searchBooks = async (
  query,
  limit = 8,
  genres = [],
  minChapter = 0,
  maxChapter = 1e6,
) => {
  if (!query.trim()) return []

  const similarityThreshold = query.length < 4 ? 0.1 : 0.25
  const startTime = performance.now()

  // 1️⃣ Build where condition
  let whereCondition = {
    [Op.or]: [
      { title: { [Op.iLike]: `%${query}%` } },
      { author: { [Op.iLike]: `%${query}%` } },
    ],
    chapter_count: { [Op.between]: [minChapter, maxChapter] },
  }

  // 2️⃣ Genre condition (filter nếu genres được truyền)
  let genreCondition = {
    include: [
      {
        model: db.Genre,
        attributes: ['id', 'name', 'description'],
        through: { attributes: [] },
        ...(genres.length > 0 ? { where: { id: { [Op.in]: genres } } } : {}),
      },
    ],
  }

  // 3️⃣ Exact match
  let exactResults = await db.Book.findAll({
    ...genreCondition,
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

  // 4️⃣ Similarity nếu exactResults chưa đủ
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
      ...genreCondition,
      where: literal(
        `GREATEST(similarity("title", '${query}'), similarity("author", '${query}')) >= ${similarityThreshold}` +
          ` AND "chapter_count" BETWEEN ${minChapter} AND ${maxChapter}` +
          (exactIds.length ? ` AND id NOT IN (${exactIds.join(',')})` : ''),
      ),
      order: [[literal('sim_score'), 'DESC']],
      limit: limit - exactResults.length,
    })
  }

  // 5️⃣ Gộp kết quả
  const results = [...exactResults, ...similarityResults]

  const endTime = performance.now()
  const searchTime = (endTime - startTime).toFixed(2)
  console.log(
    `🔍 Search "${query}" mất ${searchTime} ms, kết quả: ${results.length}`,
  )

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
