const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const NGO = sequelize.define('NGO', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cnpj: {
    type: DataTypes.STRING(18),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  logo: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  totalAreasReforested: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalTreesPlanted: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'ngos',
});

module.exports = NGO;
