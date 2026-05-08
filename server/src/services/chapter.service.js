const db = require('../models')
const { Op, literal } = require('sequelize')

exports.createChapter = async (data) => {
  const { book_id, title, author_note, content } = data

  const book = await db.Book.findByPk(book_id)

  if (!book) {
    throw new Error('Book không tồn tại')
  }

  const chapter = await db.Chapter.create({
    book_id,
    title,
    author_note,
    content,
    index: book.chapter_count + 1,
    word_count: content.trim().split(/\s+/).length,
  })

  return chapter
}

exports.getChapterById = async (id) => {
  return await db.Chapter.findByPk(id)
}

exports.updateChapter = async (id, data) => {
  console.log('Updating chapter:', id, data) // Debug log
  const chapter = await db.Chapter.findByPk(id)
  if (!chapter) {
    throw new Error('Chapter không tồn tại')
  }

  const { title, author_note, content } = data

  if (title !== undefined) chapter.title = title
  if (author_note !== undefined) chapter.author_note = author_note
  if (content !== undefined) {
    chapter.content = content
    chapter.word_count = content.trim().split(/\s+/).length
  }

  await chapter.save()
  return chapter
}

exports.deleteChapter = async (id) => {
  const chapter = await db.Chapter.findByPk(id)

  if (!chapter) {
    throw new Error('Chapter không tồn tại')
  }

  // lưu trước khi destroy
  const bookId = chapter.book_id
  const chapterIndex = chapter.index
  const deletedWords = chapter.word_count || 0

  // xóa chapter
  await chapter.destroy()

  // dồn index các chapter phía sau
  await db.Chapter.update(
    { index: literal('"index" - 1') },
    {
      where: {
        book_id: bookId,
        index: {
          [Op.gt]: chapterIndex,
        },
      },
    },
  )

  // cập nhật book
  const book = await db.Book.findByPk(bookId)
  if (book) {
    book.chapter_count = Math.max(0, book.chapter_count - 1)
    book.word_count = Math.max(0, (book.word_count || 0) - deletedWords)
    await book.save()
  }
  return true
}

exports.deleteManyChapters = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error('Danh sách chapter không hợp lệ')
  }

  // lấy chapter cần xóa
  const chapters = await db.Chapter.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
    attributes: ['id', 'book_id', 'word_count'],
    order: [['index', 'ASC']],
  })
  if (!chapters.length) {
    throw new Error('Không tìm thấy chapter')
  }
  const bookId = chapters[0].book_id

  // đảm bảo cùng 1 book
  const invalid = chapters.some((chapter) => chapter.book_id !== bookId)
  if (invalid) {
    throw new Error('Các chapter không cùng một truyện')
  }

  // tổng word bị xóa
  const deletedWords = chapters.reduce(
    (sum, chapter) => sum + (chapter.word_count || 0),
    0,
  )

  const deletedCount = chapters.length

  // xóa chapter
  await db.Chapter.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  })

  // lấy chapter còn lại
  const remainChapters = await db.Chapter.findAll({
    where: {
      book_id: bookId,
    },
    order: [['index', 'ASC']],
    attributes: ['id'],
  })

  // reindex
  await Promise.all(
    remainChapters.map((chapter, i) =>
      db.Chapter.update(
        {
          index: i + 1,
        },
        {
          where: {
            id: chapter.id,
          },
        },
      ),
    ),
  )

  // cập nhật book
  const book = await db.Book.findByPk(bookId)

  if (book) {
    book.chapter_count = Math.max(0, book.chapter_count - deletedCount)

    book.word_count = Math.max(0, (book.word_count || 0) - deletedWords)

    await book.save()
  }

  return true
}
