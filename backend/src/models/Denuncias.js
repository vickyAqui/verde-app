const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Denuncias = sequelize.define('Denuncias', {
  idDenuncias: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idArea: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  titulo: {
    type: DataTypes.STRING(35),
    allowNull: false,
  },
  dataDenuncia: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  statusDenuncia: {
    type: DataTypes.STRING(20),
    defaultValue: 'aberta',
  },
  descricao: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  foto: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'tbl_Denuncias',
  timestamps: false,
});

module.exports = Denuncias;
