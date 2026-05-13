const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
// const { create } = require('./notification.service')

const Notification = sequelize.define(
  'Notification',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    actor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    entity_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'notifications',
    underscored: true,
  },
)

module.exports = Notification
