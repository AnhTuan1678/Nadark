const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

/**
 * Image optimization pipeline (production-ready)
 *
 * format mapping (UPDATED):
 *  - 'auto' → PNG
 *  - 'webp' → PNG
 *  - 'png' → PNG
 *  - 'jpeg' → JPEG
 *
 * resizeMode:
 *  - 'always'      → luôn resize
 *  - 'only-large'  → chỉ resize nếu ảnh lớn hơn maxWidth
 *  - 'never'       → không resize
 */

exports.optimize = async (inputPath, options = {}) => {
  // ===== DEFAULT OPTIONS =====
  const {
    maxWidth = 1280,
    quality = 85,
    format = 'auto',
    resizeMode = 'only-large',
  } = options

  const image = sharp(inputPath)
  const metadata = await image.metadata()

  // ===== OUTPUT PATH =====
  const outputPath = inputPath.replace(
    path.extname(inputPath),
    `_opt.png`, // vì auto/webp/png đều ra PNG
  )

  let pipeline = image.rotate() // tự động xoay dựa trên EXIF

  // ===== RESIZE LOGIC =====
  let shouldResize = true

  if (resizeMode === 'only-large') {
    shouldResize = metadata.width > maxWidth
  }

  if (resizeMode === 'never') {
    shouldResize = false
  }

  if (shouldResize) {
    pipeline = pipeline.resize({
      width: maxWidth,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  // ===== FORMAT LOGIC (FIXED) =====
  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality })
      break

    case 'png':
    case 'webp':
    case 'auto':
    default:
      pipeline = pipeline.png({
        compressionLevel: 9,
        adaptiveFiltering: true,
      })
      break
  }

  await pipeline.toFile(outputPath)

  // ===== CLEANUP =====
  fs.unlinkSync(inputPath)

  return {
    path: outputPath,
    format: 'png', // luôn normalize về png
    width: metadata.width,
    height: metadata.height,
    resized: shouldResize,
  }
}