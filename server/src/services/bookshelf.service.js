const db = require('../models')

exports.getBookshelf = async (userId) => {
  return await db.UserBookshelf.findAll({
    where: { user_id: userId },
    include: [{ model: db.Book }],
    order: [['saved_at', 'DESC']],
  })
}

exports.addBook = async (userId, bookId) => {
  const exists = await db.UserBookshelf.findOne({
    where: { user_id: userId, book_id: bookId },
  })
  if (exists) {
    const err = new Error('Sách đã có trong tủ')
    err.status = 400
    throw err
  }
  return await db.UserBookshelf.create({ user_id: userId, book_id: bookId })
}

exports.removeBook = async (userId, bookId) => {
  const result = await db.UserBookshelf.destroy({
    where: { user_id: userId, book_id: bookId },
  })
  if (!result) {
    const err = new Error('Sách không tồn tại trong tủ')
    err.status = 404
    throw err
  }
}
