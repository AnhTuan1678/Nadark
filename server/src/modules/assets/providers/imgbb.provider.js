// modules/media/providers/imgbb.provider.js
const fs = require('fs')

exports.upload = async (filePath) => {
  const image = fs.readFileSync(filePath, {
    encoding: 'base64',
  })

  const formData = new URLSearchParams()
  formData.append('key', process.env.IMGBB_KEY)
  formData.append('image', image)

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Upload failed')
  }

  const data = await res.json()
  return data.data.url
}
