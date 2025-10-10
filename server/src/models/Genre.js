const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Book = require('./Book')

const Genre = sequelize.define(
  'Genre',
  {
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
  },
  { tableName: 'genre', timestamps: false },
)

module.exports = Genre
