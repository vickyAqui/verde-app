const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Area = sequelize.define('Area', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  areaSize: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Tamanho em hectares',
  },
  status: {
    type: DataTypes.ENUM('identified', 'in_progress', 'reforested'),
    defaultValue: 'identified',
  },
  vegetationType: {
    type: DataTypes.ENUM('forest', 'savanna', 'mangrove', 'other'),
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  reportedBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ngoId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  tableName: 'areas',
});

module.exports = Area;
