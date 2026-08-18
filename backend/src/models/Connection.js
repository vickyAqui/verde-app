const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Connection = sequelize.define('Connection', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ngoId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  areaId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed'),
    defaultValue: 'pending',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'connections',
});

module.exports = Connection;
