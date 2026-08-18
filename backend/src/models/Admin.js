const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Admin = sequelize.define('Admin', {
  idAdmin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'tbl_Admin',
  timestamps: false,
});

module.exports = Admin;
