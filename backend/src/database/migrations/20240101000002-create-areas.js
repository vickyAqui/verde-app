'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('areas', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false,
      },
      area_size: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('identified', 'in_progress', 'reforested'),
        defaultValue: 'identified',
      },
      vegetation_type: {
        type: Sequelize.ENUM('forest', 'savanna', 'mangrove', 'other'),
        allowNull: true,
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      reported_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ngo_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'ngos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    await queryInterface.dropTable('areas');
  },
};
