const router = require('express').Router()
const bookController = require('../controllers/book.controller')
const authenticateToken = require('../middleware/authenticateToken')

// Lấy top truyện theo lượt xem
router.get('/top/stats', bookController.getTopBooksStats)
router.get('/top/today', bookController.getTopBooksToday)
router.get('/top/week', bookController.getTopBooksThisWeek)
router.get('/top/month', bookController.getTopBooksThisMonth)

// Books
router.get('/', bookController.getAllBooks)
router.post('/', authenticateToken, bookController.createBook)
router.get('/my-books', authenticateToken, bookController.getMyBooks)
router.get('/user/:userId', bookController.getUserBooks)
router.get('/search', bookController.searchBooks)
router.get('/newly-updated', bookController.getNewlyUpdatedBooks)
router.get('/newly-created', bookController.getNewlyCreatedBooks)
router.get('/most-followed', bookController.getMostFollowedBooks)
router.get('/:id', bookController.getBook)

// Chapters
router.get('/:id/chapters', bookController.getChapters)
router.get('/:id/chapter/:index', bookController.getChapterByIndex)

// Reviews
router.post('/review', authenticateToken, bookController.createReview)
router.get('/:bookId/reviews', bookController.getReviews)
router.put('/review/:id', authenticateToken, bookController.updateReview)
router.delete('/review/:id', authenticateToken, bookController.deleteReview)

module.exports = router
