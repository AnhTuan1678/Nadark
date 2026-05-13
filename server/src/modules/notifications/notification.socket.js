const users = new Map()

exports.registerNotificationSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('auth', (userId) => {
      users.set(userId, socket.id)
    })

    socket.on('disconnect', () => {
      for (const [userId, socketId] of users) {
        if (socketId === socket.id) {
          users.delete(userId)
        }
      }
    })
  })
}

exports.emitToUser = (io, userId, event, payload) => {
  const socketId = users.get(userId)
  if (socketId) {
    io.to(socketId).emit(event, payload)
  }
}
