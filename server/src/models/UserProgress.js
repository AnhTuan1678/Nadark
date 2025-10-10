const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const User = require('./User')
const Book = require('./Book')

const UserProgress = sequelize.define(
  'UserProgress',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'books', key: 'id' },
    },
    last_chapter_index: {
      type: DataTypes.INTEGER,
    },
    progress_percent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'user_progress',
    timestamps: false,
    indexes: [{ unique: true, fields: ['user_id', 'book_id'] }],
  },
)

module.exports = UserProgress
