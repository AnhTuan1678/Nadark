// modules/assets/assets.service.js
const imageProcessor = require('./utils/image.processor')
const imgbb = require('./providers/imgbb.provider')
const fs = require('fs')

exports.uploadFileImage = async (file) => {
  const optimized = await imageProcessor.optimize(file.path)
  console.log('Optimized image path:', optimized)

  const url = await imgbb.upload(optimized.path)

  fs.unlinkSync(optimized.path)

  return { url }
}

exports.uploadMultipleImages = async (files) => {
  const results = await Promise.all(
    files.map(async (file) => {
      const optimized = await imageProcessor.optimize(file.path)
      const url = await imgbb.upload(optimized.path)
      fs.unlinkSync(optimized.path)
      return url
    }),
  )

  return { urls: results }
}
