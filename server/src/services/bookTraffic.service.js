const { Op, Sequelize } = require('sequelize')
const BookTraffic = require('../models/BookTraffic')
const Book = require('../models/Book')
const { formatBookTraffic } = require('../utils/formatBookTraffic')

exports.increaseBookView = async (bookId) => {
  const today = new Date().toISOString().slice(0, 10)

  const [record, created] = await BookTraffic.findOrCreate({
    where: { book_id: bookId, date: today },
    defaults: { views: 1 },
  })

  if (!created) {
    await record.increment('views', { by: 1 })
  }

  await Book.increment('views', { by: 1, where: { id: bookId } })
}

exports.getBookTrafficLast30Days = async (bookId) => {
  const data = await BookTraffic.findAll({
    where: { book_id: bookId },
    order: [['date', 'DESC']],
    limit: 30,
  })
  return data
}

exports.getTopBooksToday = async (limit = 10) => {
  const today = new Date().toISOString().slice(0, 10)

  const data = await BookTraffic.findAll({
    where: { date: today },
    include: [{ model: Book, as: 'book' }],
    order: [['views', 'DESC']],
    limit,
  })

  return formatBookTraffic(data, 'today_views', 'views')
}

exports.getTopBooksThisWeek = async (limit = 10) => {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - 7)

  const data = await BookTraffic.findAll({
    where: { date: { [Op.gte]: weekStart } },
    attributes: [
      'book_id',
      [Sequelize.fn('SUM', Sequelize.col('BookTraffic.views')), 'total_views'],
    ],
    include: [{ model: Book, as: 'book' }],
    group: ['BookTraffic.book_id', 'book.id'],
    order: [[Sequelize.literal('"total_views"'), 'DESC']],
    limit,
  })

  return formatBookTraffic(data, 'week_views', 'total_views')
}

exports.getTopBooksThisMonth = async (limit = 10) => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

  const data = await BookTraffic.findAll({
    where: { date: { [Op.gte]: firstDay } },
    attributes: [
      'book_id',
      [Sequelize.fn('SUM', Sequelize.col('BookTraffic.views')), 'total_views'],
    ],
    include: [{ model: Book, as: 'book' }],
    group: ['BookTraffic.book_id', 'book.id'],
    order: [[Sequelize.literal('"total_views"'), 'DESC']],
    limit,
  })

  return formatBookTraffic(data, 'month_views', 'total_views')
}
