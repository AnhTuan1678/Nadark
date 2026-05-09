const assetsService = require('./assets.service')

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' })

    const result = await assetsService.uploadFileImage(req.file)

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Upload failed' })
  }
}

exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ message: 'No files' })

    const result = await assetsService.uploadMultipleImages(req.files)

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Upload failed' })
  }
}
