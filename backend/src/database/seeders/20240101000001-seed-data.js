'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const nivel_usuarios = [
      { idNivel_Usuario: 1, descricao: 'comum' },
      { idNivel_Usuario: 2, descricao: 'admin' },
    ];
    await queryInterface.bulkInsert('tbl_Nivel_Usuario', nivel_usuarios);

    const senhaHash = await bcrypt.hash('123456', 10);

    const usuarios = [
      { idUsuario: 1, idNivel_Usuario: 2, nome: 'Administrador', email: 'admin@verde.com', senha: senhaHash },
      { idUsuario: 2, idNivel_Usuario: 1, nome: 'Maria Silva', email: 'maria@verde.com', senha: senhaHash },
      { idUsuario: 3, idNivel_Usuario: 1, nome: 'João Santos', email: 'joao@verde.com', senha: senhaHash },
      { idUsuario: 4, idNivel_Usuario: 1, nome: 'Roberto Carlos', email: 'roberto@verde.com', senha: senhaHash}
    ];
    await queryInterface.bulkInsert('tbl_Usuario', usuarios);

    const areas = [ 
      {
        idArea: 1, cidade: 'São Paulo', bairro: 'Cidade Tiradentes',
        rua: 'Estrada do Iguatemi',
        statusArea: 'identificada',
        latitude: -23.572,
        longitude: -46.4205,
        raio: 220,
        poligono: null,
      },
      {
        idArea: 2,
        cidade: 'São Paulo',
        bairro: 'Cidade Tiradentes',
        rua: 'Rua Inácio Monteiro',
        statusArea: 'em tratamento',
        latitude: -23.5665,
        longitude: -46.415,
        raio: 150,
        poligono: null,
      },
      {
        idArea: 3,
        cidade: 'São Paulo',
        bairro: 'Cidade Tiradentes',
        rua: 'Av. dos Têxteis',
        statusArea: 'reflorestada',
        latitude: -23.5715,
        longitude: -46.427,
        raio: 300,
        poligono: null,
      },
      {
        idArea: 4,
        cidade: 'São Paulo',
        bairro: 'Cidade Tiradentes',
        rua: 'Rua Juá Mirim',
        statusArea: 'em tratamento',
        latitude: -23.564,
        longitude: -46.422,
        raio: 180,
        poligono: JSON.stringify([
          [-23.5632, -46.4232],
          [-23.5632, -46.4208],
          [-23.5648, -46.4208],
          [-23.5648, -46.4232],
        ]),
      },
    ]
    await queryInterface.bulkInsert('tbl_Area', areas);

    const denuncias = [ 
      { idDenuncia: 1, idUsuario: 3, idArea: 2, titulo: 'Desmatamento na rua', dataDenuncia: '2026-01-15', statusDenuncia: 'aberta', descricao: 'Área com árvores derrubadas próxima à Rua Inácio Monteiro', fotos: null },
      { idDenuncia: 2, idUsuario: 3, idArea: 1, titulo: 'Descarte irregular de entulho', dataDenuncia: '2026-02-10', statusDenuncia: 'em tratamento', descricao: 'Entulho acumulado às margens da Estrada do Iguatemi', fotos: null },
    ]
    await queryInterface.bulkInsert('tbl_Denuncia', denuncias);

    const tiposConteudo = [
      { idTipo_Conteudo: 1, tipo: 'artigo' },
      { idTipo_Conteudo: 2, tipo: 'video' },
    ];
    await queryInterface.bulkInsert('tbl_Tipo_Conteudo', tiposConteudo);

    const conteudos = [
      {
        idConteudo: 1,
        idTipo_Conteudo: 1,
        categoria: 'Dicas',
        titulo: 'Passo a passo para plantar árvores frutíferas no chão.',
        tempoLeitura: 14,
        descricao: 'Aprenda como preparar o solo, abrir e adubar a cova, nivelar a muda corretamente e fazer a cobertura morta para plantar árvores frutíferas sem erros.',
        link: null,
      },
      {
        idConteudo: 2,
        idTipo_Conteudo: 1,
        categoria: 'Preservação',
        titulo: 'Por que uma cidade precisa de árvores?',
        tempoLeitura: 4,
        descricao: 'Drauzio Varella explica a importância da arborização urbana para reduzir a poluição, gerar sombra e transformar a paisagem das cidades.',
        link: null,
      },
      {
        idConteudo: 3,
        idTipo_Conteudo: 1,
        categoria: 'Benefícios',
        titulo: '7 benefícios das árvores',
        tempoLeitura: 3,
        descricao: 'A paisagista Lúcia Borges apresenta sete benefícios essenciais das árvores, incluindo melhora da qualidade do ar, redução de ruídos, conforto térmico e proteção do solo.',
        link: null,
      },
      {
        idConteudo: 4,
        idTipo_Conteudo: 2,
        categoria: null,
        titulo: null,
        tempoLeitura: null,
        descricao: null,
        link: 'https://www.youtube.com/watch?v=Oyrk7VAVjUY',
      },
      {
        idConteudo: 5,
        idTipo_Conteudo: 2,
        categoria: null,
        titulo: null,
        tempoLeitura: null,
        descricao: null,
        link: 'https://www.youtube.com/watch?v=U2TLKecNdnU',
      },
      {
        idConteudo: 6,
        idTipo_Conteudo: 2,
        categoria: null,
        titulo: null,
        tempoLeitura: null,
        descricao: null,
        link: 'https://www.youtube.com/watch?v=1PoNmDru9XM',
      },
    ];
    await queryInterface.bulkInsert('tbl_Conteudo', conteudos);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tbl_Conteudo', null, {});
    await queryInterface.bulkDelete('tbl_Tipo_Conteudo', null, {});
    await queryInterface.bulkDelete('tbl_Denuncia', null, {});
    await queryInterface.bulkDelete('tbl_Area', null, {});
    await queryInterface.bulkDelete('tbl_Usuario', null, {});
    await queryInterface.bulkDelete('tbl_Nivel_Usuario', null, {})
  },
};
