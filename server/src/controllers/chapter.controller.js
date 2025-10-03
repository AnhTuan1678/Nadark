const commentService = require('../services/comment.service')

async function getComments(req, res) {
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

async function createComment(req, res) {
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

async function deleteComment(req, res) {
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

async function getChapter(req, res) {
  try {
    const chapter = await commentService.getChapterById(req.params.id)
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' })
    res.json(chapter)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
  getComments,
  createComment,
  deleteComment,
  getChapter,
}
