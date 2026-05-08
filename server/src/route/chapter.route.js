const router = require('express').Router()
const { Router } = require('express')
const chapterController = require('../controllers/chapter.controller')
const authenticateToken = require('../middleware/authenticateToken')
const checkBookOwner = require('../middleware/checkBookOwner')
const checkChapterOwner = require('../middleware/checkChapterOwner')

// comment
router.get('/:chapterId/comment', chapterController.getComments)
router.post('/comment', authenticateToken, chapterController.createComment)
router.delete(
  '/comment/:id',
  authenticateToken,
  chapterController.deleteComment,
)

// chapter
router.get('/:chapterId', chapterController.getChapter)
router.post(
  '/create',
  authenticateToken,
  checkBookOwner,
  chapterController.createChapter,
)
router.put(
  '/:chapterId',
  authenticateToken,
  checkChapterOwner,
  chapterController.updateChapter,
)
router.delete(
  '/:chapterId',
  authenticateToken,
  checkChapterOwner,
  chapterController.deleteChapter,
)
router.delete(
  '/bulk/delete',
  authenticateToken,
  checkBookOwner,
  chapterController.deleteManyChapters,
)

module.exports = router
