'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_UsuarioComum', {
      idUsarioComum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tbl_Usuario', key: 'idUsuario' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      cpf: {
        type: Sequelize.CHAR(11),
        allowNull: false,
      },
      dataNasc: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tbl_UsuarioComum');
  },
};
