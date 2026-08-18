const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Ongs = sequelize.define('Ongs', {
  idOngs: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  regiao: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.CHAR(14),
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  descricao: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: 'tbl_Ongs',
  timestamps: false,
});

module.exports = Ongs;
