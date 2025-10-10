const sequelize = require('../config/database')

async function initDB() {
  try {
    await sequelize.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`)
    await sequelize.sync({ alter: false })
    console.log('✅ Database synchronized successfully!')
  } catch (err) {
    console.error('❌ Database sync error:', err)
  }
}

initDB()
