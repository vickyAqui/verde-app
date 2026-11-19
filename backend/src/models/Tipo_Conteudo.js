const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Tipo_Conteudo = sequelize.define('Tipo_Conteudo', {
  idTipo_Conteudo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'tbl_Tipo_Conteudo',
  timestamps: false,
});

module.exports = Tipo_Conteudo;
