const router = require('express').Router()
const progressController = require('../controllers/progress.controller')
const authenticateToken = require('../middleware/authenticateToken')

router.get('/:bookId', authenticateToken, progressController.getProgress)
router.post('/:bookId', authenticateToken, progressController.saveProgress)
router.get('/', authenticateToken, progressController.getAllProgress)

module.exports = router
