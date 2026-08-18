'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_Area', {
      idArea: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      cidade: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      bairro: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      rua: {
        type: Sequelize.STRING(35),
        allowNull: false,
      },
      statusArea: {
        type: Sequelize.STRING(20),
        defaultValue: 'identificada',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tbl_Area');
  },
};
