const multer = require('multer')
const fs = require('fs')
const path = require('path')

const tempDir = path.join(process.cwd(), 'temp')
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `media_${Date.now()}${ext}`)
  },
})

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})