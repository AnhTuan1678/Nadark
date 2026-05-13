const service = require('./notification.service')

exports.getMine = async (req, res) => {
  try {
    const data = await service.getMine(req.user.id)
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Lỗi tải notifications',
    })
  }
}

exports.read = async (req, res) => {
  try {
    await service.markRead(req.params.id, req.user.id)

    res.json({
      success: true,
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: 'Lỗi read notification',
    })
  }
}

exports.readAll = async (req, res) => {
  try {
    await service.markAllRead(req.user.id)

    res.json({
      success: true,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Lỗi read all notifications',
    })
  }
}

exports.unreadCount = async (req, res) => {
  try {
    const count = await service.getUnreadCount(req.user.id)
    res.json({
      unread: count,
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: 'Lỗi unread count',
    })
  }
}
