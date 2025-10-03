const router = require('express').Router()
const db = require('../models/index')
const bcrypt = require('bcrypt')
const upload = require('../utils/multer')
const uploadToImgBB = require('../utils/imgbb')
const fs = require('fs')
const authenticateToken = require('../middleware/authenticateToken')
const { Sequelize } = require('sequelize')

// ============================
// Đổi avatar
// ============================
// router.post(
//   '/avatar',
//   authenticateToken,
//   upload.single('avatar'),
//   async (req, res) => {
//     try {
//       if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' })

//       const user = await db.User.findByPk(req.user.id)
//       if (!user) return res.status(404).json({ message: 'User không tồn tại' })

//       // Upload lên ImgBB
//       const apiKey = process.env.IMGBB_API_KEY
//       const imagePath = req.file.path
//       const avatarUrl = await uploadToImgBB(imagePath, apiKey)

//       // Cập nhật user
//       user.avatar_url = avatarUrl
//       user.updated_at = new Date()
//       await user.save()

//       fs.unlinkSync(req.file.path)

//       res.json({
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         avatarUrl: user.avatar_url,
//         createdDate: user.created_at,
//       })
//     } catch (err) {
//       console.error(err)
//       res.status(500).json({ message: 'Upload avatar thất bại' })
//     }
//   },
// )

// ============================
// Thêm / Xoá sách
// ============================
router.post('/bookshelf', authenticateToken, async (req, res) => {
  try {
    const { book_id } = req.body
    if (!book_id) return res.status(400).json({ error: 'Thiếu book_id' })

    // Kiểm tra xem sách đã có trong tủ chưa
    const existingEntry = await db.UserBookshelf.findOne({
      where: { user_id: req.user.id, book_id },
    })

    if (existingEntry) {
      // Nếu đã có => xoá
      await db.UserBookshelf.destroy({
        where: { user_id: req.user.id, book_id },
      })
      await db.Book.decrement('followers', { by: 1, where: { id: book_id } })

      const book = await db.Book.findByPk(book_id)
      return res.json({
        message: 'Đã xoá khỏi tủ sách',
        status: 'warning',
        action: 'removed',
        book,
      })
    }

    // Nếu chưa có => thêm
    await db.UserBookshelf.create({
      user_id: req.user.id,
      book_id,
      saved_at: new Date(),
    })
    await db.Book.increment('followers', { by: 1, where: { id: book_id } })

    const book = await db.Book.findByPk(book_id)
    return res.json({
      message: 'Đã thêm vào tủ sách',
      status: 'success',
      action: 'added',
      book,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

module.exports = router
