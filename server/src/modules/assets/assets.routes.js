const router = require('express').Router()
const upload = require('./middlewares/upload.middleware')
const assetsController = require('./assets.controller')

// upload 1 tệp
router.post('/upload', upload.single('file'), assetsController.uploadImage)

// upload nhiều tệp
router.post(
  '/upload/multiple',
  upload.array('files', 10),
  assetsController.uploadMultipleImages,
)

module.exports = router
