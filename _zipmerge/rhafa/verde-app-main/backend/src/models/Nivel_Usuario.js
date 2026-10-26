const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Nivel_Usuario = sequelize.define('Nivel_Usuario', {
  idNivel_Usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  descricao: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: [['comum', 'admin', 'ong']],
    },
  },
}, {
  tableName: 'tbl_Nivel_Usuario', 
  timestamps: false,
});

module.exports = Nivel_Usuario;