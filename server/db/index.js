;(() => {
  const fs = require('fs')
  const path = require('path')
  const { addBook, addChapter } = require('./insertData')
  const db = require('../src/models/index')

  const url = 'D:/Truyện/Động phòng nha hoàn kiều nhuyễn động lòng người'

  fs.readdir(url, async (err, files) => {
    if (err) {
      console.error('Không đọc được folder:', err)
      return
    }

    try {
      // Thêm sách
      const book = await addBook(
        'Động phòng nha hoàn kiều nhuyễn động lòng người',
        'Tác giả chưa rõ',
        'Tự động nhập từ folder',
        new Date().toISOString().slice(0, 10),
      )
      console.log('Book:', book.toJSON())

      // Sắp xếp files theo số chương
      const sortedFiles = files
        .map((file) => {
          const match = file.match(/Thứ (\d+) chương/)
          const index = match ? parseInt(match[1], 10) : 0
          return { file, index }
        })
        .sort((a, b) => a.index - b.index)

      for (const { file, index } of sortedFiles) {
        const filePath = path.join(url, file)
        const content = fs.readFileSync(filePath, 'utf8')

        // Cắt "Thứ X chương" ra khỏi title
        const title = file
          .replace(/Thứ \d+ chương\s*/i, '')
          .replace(/\.[^/.]+$/, '')

        // Thêm chương
        await addChapter(book.id, title, content, 'Tuan')
        console.log(`Chương ${index}: ${title}`)
      }
    } catch (err) {
      console.error('Lỗi khi thêm truyện/chương:', err)
    }
  })
})()
