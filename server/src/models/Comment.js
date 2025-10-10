const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const User = require('./User')
const Chapter = require('./Chapter')

const Comment = sequelize.define(
  'Comment',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'chapters', key: 'id' },
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'comments', key: 'id' }, // tự tham chiếu
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'comments',
    timestamps: false,
  },
)

module.exports = Comment
