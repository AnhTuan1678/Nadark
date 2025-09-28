const router = require('express').Router()
const db = require('../models/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

// ============================
// Đăng ký
// ============================
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' })
    }

    const existingUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ username }, { email }],
      },
    })
    if (existingUser) {
      return res.status(409).json({ error: 'Username hoặc email đã tồn tại' })
    }

    const password_hash = await bcrypt.hash(password, 10)

    // Tạo user mới
    const newUser = await db.User.create({
      username,
      email,
      password_hash,
    })

    // Tạo JWT
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }, // token hết hạn sau 7 ngày
    )

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      personal_settings: newUser.personal_settings,
      url_avar: newUser.url_aver,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
      token,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ============================
// Đăng nhập
// ============================
router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' })
    }

    // Tìm user theo username hoặc email
    const user = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { username: usernameOrEmail },
          { email: usernameOrEmail },
        ],
      },
    })

    if (!user) {
      return res.status(401).json({ error: 'Sai username/email hoặc mật khẩu' })
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Sai username/email hoặc mật khẩu' })
    }

    // Tạo JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' },
    )

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      personal_settings: user.personal_settings,
      url_avar: user.url_aver,
      personal_settings: user.personal_settings,
      token,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ============================
// Middleware xác thực JWT
// ============================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  console.log(authHeader)
  const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Token không tồn tại' })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token không hợp lệ' })
    req.user = user
    next()
  })
}

// ============================
// Lấy thông tin user
// ============================
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: [
        'id',
        'username',
        'email',
        'personal_settings',
        'created_at',
        'updated_at',
      ],
    })

    if (!user)
      return res.status(404).json({ error: 'Người dùng không tồn tại' })

    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
