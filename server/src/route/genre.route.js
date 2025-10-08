const express = require('express')
const router = express.Router()
const Genre = require('../models/Genre')

router.get('/', async (req, res) => {
  try {
    const genres = await Genre.findAll({
      order: [['name', 'ASC']],
    })
    res.json(genres)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy thể loại' })
  }
})

module.exports = router
