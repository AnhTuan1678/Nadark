const bookService = require('../services/book.service')

async function getAllBooks(req, res) {
  try {
    const books = await bookService.getAllBooks()
    res.json(books)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function searchBooks(req, res) {
  try {
    const { query } = req.query
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query không được để trống' })
    }
    const books = await bookService.searchBooks(query)
    res.json(books)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function getBook(req, res) {
  try {
    const book = await bookService.getBookById(req.params.id)
    if (!book) return res.status(404).json({ error: 'Book not found' })
    res.json(book)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function getChapters(req, res) {
  try {
    const chapters = await bookService.getChaptersByBookId(req.params.id)
    res.json(chapters)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function getChapterByIndex(req, res) {
  try {
    const index = parseInt(req.params.index, 10)
    if (isNaN(index) || index < 1) {
      return res.status(400).json({ error: 'Index không hợp lệ' })
    }
    const chapter = await bookService.getChapterByIndex(req.params.id, index)
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' })
    res.json(chapter)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function createReview(req, res) {
  try {
    const review = await bookService.createReview(req.user.id, req.body)
    res.status(201).json(review)
  } catch (err) {
    if (err.message === 'BOOK_NOT_FOUND')
      return res.status(404).json({ message: 'Không tìm thấy sách' })
    if (err.message === 'ALREADY_REVIEWED')
      return res.status(400).json({ message: 'Đã review' })
    res.status(500).json({ message: 'Server error' })
  }
}

async function getReviews(req, res) {
  try {
    const reviews = await bookService.getReviews(req.params.bookId)
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

async function updateReview(req, res) {
  try {
    const updated = await bookService.updateReview(
      req.user.id,
      req.params.id,
      req.body,
    )
    res.json(updated)
  } catch (err) {
    if (err.message === 'REVIEW_NOT_FOUND')
      return res.status(404).json({ message: 'Review not found' })
    if (err.message === 'FORBIDDEN')
      return res.status(403).json({ message: 'Forbidden' })
    res.status(500).json({ message: 'Server error' })
  }
}

async function deleteReview(req, res) {
  try {
    await bookService.deleteReview(req.user.id, req.params.id)
    res.json({ message: 'Review deleted successfully' })
  } catch (err) {
    if (err.message === 'REVIEW_NOT_FOUND')
      return res.status(404).json({ message: 'Review not found' })
    if (err.message === 'FORBIDDEN')
      return res.status(403).json({ message: 'Forbidden' })
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getAllBooks,
  searchBooks,
  getBook,
  getChapters,
  getChapterByIndex,
  createReview,
  getReviews,
  updateReview,
  deleteReview,
}
