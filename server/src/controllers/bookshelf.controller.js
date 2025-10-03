const bookshelfService = require('../services/bookshelf.service')

exports.getBookshelf = async (req, res) => {
  try {
    const books = await bookshelfService.getBookshelf(req.user.id)
    res.json(books)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.addBook = async (req, res) => {
  try {
    const book = await bookshelfService.addBook(req.user.id, req.body.book_id)
    res.status(201).json(book)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.removeBook = async (req, res) => {
  try {
    await bookshelfService.removeBook(req.user.id, req.params.bookId)
    res.json({ message: 'Đã xóa sách khỏi tủ' })
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}
