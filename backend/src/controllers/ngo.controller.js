const { Ongs, Usuario } = require('../models');

const listONGs = async (req, res) => {
  try {
    const { regiao } = req.query;

    const where = {};
    if (regiao) where.regiao = regiao;

    const ongs = await Ongs.findAll({
      where,
      include: [{ model: Usuario, as: 'usuario', attributes: ['idUsuario', 'nome', 'email'] }],
      order: [['idOngs', 'DESC']],
    });

    return res.json({ ongs });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar ONGs' });
  }
};

const getONG = async (req, res) => {
  try {
    const ong = await Ongs.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'usuario', attributes: ['idUsuario', 'nome', 'email'] }],
    });

    if (!ong) {
      return res.status(404).json({ error: 'ONG não encontrada' });
    }

    return res.json({ ong });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar ONG' });
  }
};

const createONG = async (req, res) => {
  try {
    const { regiao, cnpj, telefone, descricao } = req.body;

    const ong = await Ongs.create({
      idUsuario: req.user.idUsuario,
      regiao,
      cnpj,
      telefone,
      descricao,
    });

    return res.status(201).json({ ong });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar ONG' });
  }
};

module.exports = { listONGs, getONG, createONG };
