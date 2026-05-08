const { Op } = require('sequelize')
const db = require('../models')

const checkManyChapterOwner = async (req, res, next) => {
  try {
    let ids = req.body?.chapterIds || []

    // hỗ trợ cả single id
    const singleId =
      req.params?.chapterId ||
      req.body?.chapterId ||
      req.query?.chapterId ||
      req.params?.chapter_id ||
      req.body?.chapter_id ||
      req.query?.chapter_id
    if (singleId) {
      ids.push(singleId)
    }

    // remove duplicate
    ids = [...new Set(ids.map(Number).filter(Boolean))]

    if (!ids.length) {
      return res.status(400).json({
        message: 'Thiếu chapter ids',
      })
    }

    // query 1 lần
    const chapters = await db.Chapter.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      include: [
        {
          model: db.Book,
          as: 'Book',
          attributes: ['id', 'uploader_id'],
        },
      ],
    })

    // thiếu chapter
    if (chapters.length !== ids.length) {
      return res.status(404).json({
        message: 'Một hoặc nhiều chapter không tồn tại',
      })
    }

    // kiểm tra ownership
    const invalid = chapters.some(
      (chapter) => !chapter.Book || chapter.Book.uploader_id !== req.user.id,
    )

    if (invalid) {
      return res.status(403).json({
        message: 'Bạn không có quyền thao tác chapter này',
      })
    }

    req.chapters = chapters

    // nếu cùng book
    req.book = chapters[0].Book

    next()
  } catch (err) {
    console.error('checkManyChapterOwner:', err)

    return res.status(500).json({
      message: 'Lỗi kiểm tra quyền chapter',
    })
  }
}

module.exports = checkManyChapterOwner
