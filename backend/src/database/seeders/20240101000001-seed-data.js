'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const senhaHash = await bcrypt.hash('123456', 10);

    const usuarios = [
      { idUsuario: 1, nome: 'Administrador', email: 'admin@verde.com', senha: senhaHash },
      { idUsuario: 2, nome: 'Maria Silva', email: 'maria@verde.com', senha: senhaHash },
      { idUsuario: 3, nome: 'João Santos', email: 'joao@verde.com', senha: senhaHash },
    ];

    await queryInterface.bulkInsert('tbl_Usuario', usuarios);

    await queryInterface.bulkInsert('tbl_Admin', [
      { idAdmin: 1, idUsuario: 1 },
    ]);

    await queryInterface.bulkInsert('tbl_UsuarioComum', [
      { idUsarioComum: 1, idUsuario: 2, cpf: '12345678901', dataNasc: '1995-06-15' },
      { idUsarioComum: 2, idUsuario: 3, cpf: '98765432100', dataNasc: '1990-03-22' },
    ]);

    await queryInterface.bulkInsert('tbl_Ongs', [
      { idOngs: 1, idUsuario: 2, regiao: 'Centro-Sul', cnpj: '12345678000190', telefone: '(11) 99999-0001', descricao: 'ONG de reflorestamento urbano' },
    ]);

    await queryInterface.bulkInsert('tbl_Area', [
      { idArea: 1, cidade: 'São Paulo', bairro: 'Mooca', rua: 'Rua da Graça', statusArea: 'identificada' },
      { idArea: 2, cidade: 'São Paulo', bairro: 'Tatuapé', rua: 'Rua Rui Barbosa', statusArea: 'em tratamento' },
    ]);

    await queryInterface.bulkInsert('tbl_Projeto', [
      { id_Projeto: 1, idUsuario: 2, objetivo: 'Reflorestar área urbana', descricao: 'Plantio de 50 árvores na Mooca', percentualConclusao: 30 },
    ]);

    await queryInterface.bulkInsert('tbl_Denuncias', [
      { idDenuncias: 1, idUsuario: 3, idArea: 1, titulo: 'Desmatamento na rua', dataDenuncia: '2024-08-15', statusDenuncia: 'aberta', descricao: 'Área com árvores derrubadas', foto: null },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tbl_Denuncias', null, {});
    await queryInterface.bulkDelete('tbl_Projeto', null, {});
    await queryInterface.bulkDelete('tbl_Area', null, {});
    await queryInterface.bulkDelete('tbl_Ongs', null, {});
    await queryInterface.bulkDelete('tbl_UsuarioComum', null, {});
    await queryInterface.bulkDelete('tbl_Admin', null, {});
    await queryInterface.bulkDelete('tbl_Usuario', null, {});
  },
};
