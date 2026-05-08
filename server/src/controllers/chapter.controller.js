const commentService = require('../services/comment.service')
const chapterService = require('../services/chapter.service')

exports.getComments = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByChapter(
      req.params.chapterId,
    )
    res.json(comments)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Lỗi khi lấy comments' })
  }
}

exports.createComment = async (req, res) => {
  try {
    const { chapter_id, parent_id, content } = req.body
    if (!content)
      return res.status(400).json({ message: 'Nội dung không được rỗng' })

    const comment = await commentService.createComment(req.user.id, {
      chapter_id,
      parent_id,
      content,
    })
    res.status(201).json(comment)
  } catch (err) {
    console.error(err)
    if (err.message === 'CHAPTER_NOT_FOUND')
      return res.status(404).json({ message: 'Chapter không tồn tại' })
    if (err.message === 'PARENT_NOT_FOUND')
      return res.status(404).json({ message: 'Comment cha không tồn tại' })
    res.status(500).json({ message: 'Lỗi khi tạo comment' })
  }
}

exports.deleteComment = async (req, res) => {
  try {
    await commentService.deleteComment(req.user.id, req.params.id)
    res.json({ message: 'Xoá thành công' })
  } catch (err) {
    console.error(err)
    if (err.message === 'COMMENT_NOT_FOUND')
      return res.status(404).json({ message: 'Comment không tồn tại' })
    if (err.message === 'FORBIDDEN')
      return res
        .status(403)
        .json({ message: 'Bạn không có quyền xoá comment này' })
    res.status(500).json({ message: 'Lỗi khi xoá comment' })
  }
}

exports.getChapter = async (req, res) => {
  try {
    const chapter = await commentService.getChapterById(req.params.chapterId)
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' })
    res.json(chapter)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.createChapter = async (req, res) => {
  try {
    const chapter = await chapterService.createChapter(req.body)
    res.status(201).json(chapter)
    // res.status(201).json({ message: 'Chapter created successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Lỗi khi tạo chapter' })
  }
}

exports.updateChapter = async (req, res) => {
  try {
    const chapter = await chapterService.updateChapter(req.params.chapterId, req.body)
    res.json(chapter)
  } catch (err) {
    console.error(err)
    if (err.message === 'Chapter không tồn tại')
      return res.status(404).json({ message: 'Chapter không tồn tại' })
    res.status(500).json({ message: 'Lỗi khi cập nhật chapter' })
  }
}

exports.deleteChapter = async (req, res) => {
  try {
    await chapterService.deleteChapter(req.params.chapterId)
    res.json({ message: 'Xoá chapter thành công' })
  } catch (err) {
    console.error(err)
    if (err.message === 'Chapter không tồn tại')
      return res.status(404).json({ message: 'Chapter không tồn tại' })
    res.status(500).json({ message: 'Lỗi khi xoá chapter' })
  }
}

exports.deleteManyChapters = async (req, res) => {
  try {
    const { ids } = req.body
    await chapterService.deleteManyChapters(ids)
    res.json({ message: 'Xoá chapters thành công' })
  } catch (err) {
    console.error(err)
    if (err.message === 'Danh sách chapter không hợp lệ')
      return res.status(400).json({ message: 'Danh sách chapter không hợp lệ' })
    if (err.message === 'Không tìm thấy chapter')
      return res.status(404).json({ message: 'Không tìm thấy chapter' })
    res.status(500).json({ message: 'Lỗi khi xoá chapters' })
  }
}
