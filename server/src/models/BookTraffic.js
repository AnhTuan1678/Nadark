const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Book = require('./Book')

const BookTraffic = sequelize.define(
  'BookTraffic',
  {
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'books',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'book_traffic',
    timestamps: false,
    indexes: [{ unique: true, fields: ['book_id', 'date'] }],
  },
)

module.exports = BookTraffic
