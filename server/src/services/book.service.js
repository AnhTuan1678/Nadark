const db = require('../models')
const { Op } = require('sequelize')

exports.getAllBooks = async () => {
  return db.Book.findAll()
}

exports.searchBooks = async (query) => {
  return db.Book.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${query}%` } },
        { author: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ],
    },
    limit: 5,
  })
}

exports.getBookById = async (id) => {
  return db.Book.findByPk(id)
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
