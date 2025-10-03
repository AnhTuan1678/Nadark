const db = require('../models')
const { Op } = require('sequelize')

async function getAllBooks() {
  return db.Book.findAll()
}

async function searchBooks(query) {
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

async function getBookById(id) {
  return db.Book.findByPk(id)
}

async function getChaptersByBookId(bookId) {
  return db.Chapter.findAll({
    where: { book_id: bookId },
    order: [['id', 'ASC']],
  })
}

async function getChapterByIndex(bookId, index) {
  return db.Chapter.findOne({
    where: { book_id: bookId },
    order: [['id', 'ASC']],
    offset: index - 1,
    limit: 1,
  })
}

async function createReview(userId, { book_id, content, rating }) {
  const book = await db.Book.findByPk(book_id)
  if (!book) throw new Error('BOOK_NOT_FOUND')

  const existing = await db.Review.findOne({
    where: { book_id, user_id: userId },
  })
  if (existing) throw new Error('ALREADY_REVIEWED')

  return db.Review.create({ user_id: userId, book_id, content, rating })
}

async function getReviews(bookId) {
  return db.Review.findAll({
    where: { book_id: bookId },
    include: [{ model: db.User, attributes: ['id', 'username', 'avatar_url'] }],
    order: [['created_at', 'DESC']],
  })
}

async function updateReview(userId, reviewId, { content, rating }) {
  const review = await db.Review.findByPk(reviewId)
  if (!review) throw new Error('REVIEW_NOT_FOUND')
  if (review.user_id !== userId) throw new Error('FORBIDDEN')

  review.content = content || review.content
  review.rating = rating || review.rating
  review.updated_at = new Date()

  return review.save()
}

async function deleteReview(userId, reviewId) {
  const review = await db.Review.findByPk(reviewId)
  if (!review) throw new Error('REVIEW_NOT_FOUND')
  if (review.user_id !== userId) throw new Error('FORBIDDEN')

  await review.destroy()
  return true
}

module.exports = {
  getAllBooks,
  searchBooks,
  getBookById,
  getChaptersByBookId,
  getChapterByIndex,
  createReview,
  getReviews,
  updateReview,
  deleteReview,
}
