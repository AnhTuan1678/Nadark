const eventBus = require('../eventBus')
const ChapterEvents = require('../chapter.events')
const db = require('../../models')
const notificationService = require('../../modules/notifications/notification.service')
const NotificationTypes = require('../../modules/notifications/notification.types')

eventBus.on(
  ChapterEvents.CHAPTER_CREATED,
  async ({ chapter, book }) => {
    try {
      const follows = await db.UserBookshelf.findAll({
        where: {
          book_id: book.id,
        },
        attributes: ['user_id'],
      })

      const followers = follows.filter((x) => x.user_id !== book.uploader_id)
      await Promise.all(
        followers.map((follow) =>
          notificationService.create({
            userId: follow.user_id,
            actorId: book.uploader_id,
            type: NotificationTypes.NEW_CHAPTER,
            entityType: 'book',
            entityId: book.id,
            metadata: {
              chapterId: chapter.id,
              chapterTitle: chapter.title,
              chapterIndex: chapter.index,
              bookTitle: book.title,
              bookCover: book.url_avatar,
            },
          }),
        ),
      )
    } catch (err) {
      console.error('Notification listener error:', err)
    }
  },
)
