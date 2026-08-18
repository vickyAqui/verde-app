'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('connections', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ngo_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'ngos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      area_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'areas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected', 'completed'),
        defaultValue: 'pending',
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('connections');
  },
};
