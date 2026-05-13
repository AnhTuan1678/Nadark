const router = require('express').Router()
const controller = require('./notification.controller')
const authenticateToken = require('../../middleware/authenticateToken')

router.get('/', authenticateToken, controller.getMine)
router.get('/unread-count', authenticateToken, controller.unreadCount)
router.patch('/:id/read', authenticateToken, controller.read)
router.patch('/read-all', authenticateToken, controller.readAll)

module.exports = router
