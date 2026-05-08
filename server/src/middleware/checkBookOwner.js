const db = require('../models')

const checkBookOwner = async (req, res, next) => {
  try {
    const bookId =
      req.body?.book_id ||
      req.params?.book_id ||
      req.query?.book_id ||
      req.body?.bookId ||
      req.params?.bookId ||
      req.query?.bookId

    if (!bookId) {
      return res.status(400).json({
        message: 'Thiếu book_id',
      })
    }

    const book = await db.Book.findByPk(bookId)

    if (!book) {
      return res.status(404).json({
        message: 'Không tìm thấy truyện',
      })
    }
    // kiểm tra chủ sở hữu
    if (book.uploader_id !== req.user.id) {
      return res.status(403).json({
        message: 'Bạn không có quyền chỉnh sửa truyện này',
      })
    }
    // gắn book vào request
    req.book = book
    next()
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: 'Lỗi kiểm tra quyền truyện',
    })
  }
}

module.exports = checkBookOwner
