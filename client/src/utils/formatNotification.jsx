// import { bookAPI } from '../../services/api'

const presentNewChapter = async (notification) => {
  return {
    id: notification.id,
    type: notification.type,
    text: `${notification.metadata.bookTitle} vừa cập nhật chapter mới`,
    action:
      `/story/${notification.entity_id}` +
      `/chapter/${notification.metadata.chapterIndex}`,
    isRead: notification.is_read,
    createdAt: notification.createdAt,
    content: (
      <div className='row w-100 gx-2'>
        <img
          src={notification.metadata.bookCover}
          alt='cover'
          style={{ width: 40, height: 60, objectFit: 'cover' }}
        />
        <div className='col p-0'>
          <b className='d-flex justify-content-between w-100 fs-6'>
            Hệ thống
            <span className='text-muted fs-8'>
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </b>
          <p className='m-0 p-0 fs-7 text-success'>
            Truyện <b>{notification.metadata.bookTitle}</b> đã cập nhật chương
            mới
          </p>
          <p className='text-muted m-0 p-0 fs-8'>
            Chương {notification.metadata.chapterIndex}:{' '}
            {notification.metadata.chapterTitle}
          </p>
        </div>
      </div>
    ),
  }
}

const presentCommentReply = async (notification, actorName) => ({
  id: notification.id,
  type: notification.type,
  text: `${actorName} đã trả lời bình luận của bạn`,
  action: `/comment/${notification.entity_id}`,
  isRead: notification.is_read,
  createdAt: notification.createdAt,
})

const presentCommentMention = async (notification, actorName) => ({
  id: notification.id,
  type: notification.type,
  text: `${actorName} đã nhắc tới bạn`,
  action: `/comment/${notification.entity_id}`,
  isRead: notification.is_read,
  createdAt: notification.createdAt,
})

const defaultPresenter = async (notification) => ({
  id: notification.id,
  type: notification.type,
  text: 'Bạn có một thông báo mới',
  action: '/',
  isRead: notification.is_read,
  createdAt: notification.createdAt,
})

const handlers = {
  new_chapter: presentNewChapter,
  comment_reply: presentCommentReply,
  comment_mention: presentCommentMention,
}

export const formatNotification = async (notification) => {
  const actorName = notification.actor?.username || 'Hệ thống'
  const handler = await handlers[notification.type]
  if (!handler) {
    return defaultPresenter(notification)
  }
  return handler(notification, actorName)
}
