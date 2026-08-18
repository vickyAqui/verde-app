'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('ngos', [
      {
        id: require('uuid').v4(),
        name: 'Instituto Árvore Verde',
        email: '@arvoreverde.org',
        description: 'ONG dedicada ao reflorestamento de áreas degradadas no cerrado brasileiro.',
        cnpj: '12.345.678/0001-90',
        phone: '(61) 99999-0001',
        status: 'approved',
        total_areas_reforested: 45,
        total_trees_planted: 12000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: require('uuid').v4(),
        name: 'Verde Futuro',
        email: 'contato@verdefuturo.org',
        description: 'Promovendo a restauração ecológica em áreas urbanas e rurais.',
        cnpj: '98.765.432/0001-10',
        phone: '(11) 98888-0002',
        status: 'approved',
        total_areas_reforested: 28,
        total_trees_planted: 8500,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ngos', null, {});
  },
};
