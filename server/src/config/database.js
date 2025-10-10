const { Sequelize } = require('sequelize')

// Khởi tạo kết nối
const sequelize = new Sequelize(
  process.env.DB_NAME || 'NaDark',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '1',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions:
      process.env.DB_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    logging: false,
  },
)

// Kiểm tra kết nối
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ DB connected!')

    // Postgresql trên Render tự ngủ nếu 10p không có truy cập
    // => Ping database mỗi 5 phút
    setInterval(async () => {
      try {
        await sequelize.query('SELECT NOW()') // Lấy thời gian thực từ DB
        const now = new Date()
        const timeStr = now
          .toTimeString()
          .split(' ')[0]
        console.log(`${timeStr}: giữ kết nối db`)
      } catch (err) {
        console.error('❌ DB ping error:', err.message)
      }
    }, 5 * 60 * 1000)
  })
  .catch((err) => console.error('❌ DB connection error:', err))

module.exports = sequelize
