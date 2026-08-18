'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const adminId = uuidv4();
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        name: 'Administrador',
        email: 'admin@verde.com',
        password: hashedPassword,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: userId,
        name: 'Usuário Teste',
        email: 'usuario@verde.com',
        password: hashedPassword,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
