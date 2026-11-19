const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Conteudo = sequelize.define('Conteudo', {
  idConteudo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idTipo_Conteudo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  tempoLeitura: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  link: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'tbl_Conteudo',
  timestamps: false,
});

module.exports = Conteudo;
