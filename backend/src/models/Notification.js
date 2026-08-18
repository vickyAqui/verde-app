const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('area_update', 'ngo_connection', 'system', 'reforestation'),
    defaultValue: 'system',
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'notifications',
});

module.exports = Notification;
