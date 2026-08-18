const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const UsuarioComum = sequelize.define('UsuarioComum', {
  idUsarioComum: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.CHAR(11),
    allowNull: false,
  },
  dataNasc: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'tbl_UsuarioComum',
  timestamps: false,
});

module.exports = UsuarioComum;
