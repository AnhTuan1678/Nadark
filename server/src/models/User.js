const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const User = sequelize.define(
  'User',
  {
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password_hash: { type: DataTypes.TEXT, allowNull: false },
    avatar_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'https://bit.ly/478koYr',
    },
    personal_settings: { type: DataTypes.JSONB, defaultValue: {} },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'users',
    timestamps: true,
  },
)

module.exports = User
