'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_Tipo_Conteudo', {
      idTipo_Conteudo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
    });

    await queryInterface.createTable('tbl_Conteudo', {
      idConteudo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      idTipo_Conteudo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tbl_Tipo_Conteudo', key: 'idTipo_Conteudo' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      categoria: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      titulo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      tempoLeitura: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      descricao: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      link: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });

  },

  async down(queryInterface) {
    await queryInterface.dropTable('tbl_Conteudo');
    await queryInterface.dropTable('tbl_Tipo_Conteudo');
  },
};
