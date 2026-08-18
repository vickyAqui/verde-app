const { Projeto, Usuario } = require('../models');

const listProjetos = async (req, res) => {
  try {
    const projetos = await Projeto.findAll({
      where: { idUsuario: req.user.idUsuario },
      order: [['id_Projeto', 'DESC']],
    });

    return res.json({ projetos });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar projetos' });
  }
};

const getProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.findByPk(req.params.id);

    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    return res.json({ projeto });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar projeto' });
  }
};

const createProjeto = async (req, res) => {
  try {
    const { objetivo, descricao } = req.body;

    const projeto = await Projeto.create({
      idUsuario: req.user.idUsuario,
      objetivo,
      descricao,
      percentualConclusao: 0,
    });

    return res.status(201).json({ projeto });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar projeto' });
  }
};

const updateProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.findByPk(req.params.id);

    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (projeto.idUsuario !== req.user.idUsuario) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    await projeto.update(req.body);

    return res.json({ projeto });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar projeto' });
  }
};

const deleteProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.findByPk(req.params.id);

    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (projeto.idUsuario !== req.user.idUsuario) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    await projeto.destroy();

    return res.json({ message: 'Projeto removido com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao remover projeto' });
  }
};

module.exports = { listProjetos, getProjeto, createProjeto, updateProjeto, deleteProjeto };
