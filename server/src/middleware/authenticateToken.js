const jwt = require('jsonwebtoken')

// ============================
// Middleware xác thực JWT
// ============================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Token không tồn tại' })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token không hợp lệ' })
    req.user = user
    next()
  })
}
