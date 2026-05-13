const db = require('../../models')

exports.create = async ({
  userId,
  actorId = null,
  type,
  entityType = null,
  entityId = null,
  metadata = {},
}) => {
  return db.Notification.create({
    user_id: userId,
    actor_id: actorId,
    type,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  })
}

exports.getMine = async (userId) => {
  const notifications = await db.Notification.findAll({
    where: {
      user_id: userId,
    },
    include: [
      {
        model: db.User,
        as: 'actor',
        attributes: ['id', 'username', 'avatar_url'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: 50,
  })

  return notifications
}

exports.markRead = async (id, userId) => {
  await db.Notification.update(
    {
      is_read: true,
    },
    {
      where: {
        id,
        user_id: userId,
      },
    },
  )
}

exports.markAllRead = async (userId) => {
  await db.Notification.update(
    {
      is_read: true,
    },
    {
      where: {
        user_id: userId,
      },
    },
  )
}

exports.getUnreadCount = async (userId) => {
  return db.Notification.count({
    where: {
      user_id: userId,
      is_read: false,
    },
  })
}
