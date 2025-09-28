const { Sequelize } = require('sequelize')

// Khởi tạo kết nối
const sequelize = new Sequelize('NaDark', 'postgres', '1', {
  host: '127.0.0.1',
  dialect: 'postgres',
  logging: false,
})

// Kiểm tra kết nối
sequelize
  .authenticate()
  .then(() => console.log('DB connected!'))
  .catch((err) => console.error('DB connection error:', err))

module.exports = sequelize
