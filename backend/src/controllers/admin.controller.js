const { Usuario, Area, Denuncia, Nivel_Usuario } = require('../models');

const dashboardStats = async (req, res) => {
  try {
    const totalUsuarios = await Usuario.count();
    const totalAdmins = await Usuario.count({ where: {idNivel_Usuario: 2} });
    const totalComuns = await Usuario.count({ where: {idNivel_Usuario: 1} });
    const totalAreas = await Area.count();
    const totalDenuncias = await Denuncia.count();
    const denunciasAbertas = await Denuncia.count({ where: { statusDenuncia: 'aberta' } });

    return res.json({
      stats: {
        totalUsuarios,
        totalAdmins,
        totalComuns,
        totalAreas,
        totalDenuncias,
        denunciasAbertas,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

const listUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['senha'] },
      include: [{ model: Nivel_Usuario, as: 'nivel', attributes: ['descricao'] }]
    });
    return res.json({ usuarios });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

const listAreas = async (req, res) => {
  try {
    const areas = await Area.findAll({ order: [['idArea', 'DESC']] });
    return res.json({ areas });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar áreas' });
  }
};

const listDenuncias = async (req, res) => {
  try {
    const denuncias = await Denuncia.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['idUsuario', 'nome'] },
        { model: Area, as: 'area', attributes: ['idArea', 'cidade', 'bairro', 'rua', 'latitude', 'longitude', 'raio', 'poligono', 'statusArea'] },
      ],
      order: [['idDenuncia', 'DESC']],
    });
    return res.json({ denuncias });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar denúncias' });
  }
};

const updateDenunciaStatus = async (req, res) => {
  try {
    const allowedStatuses = ['aberta', 'em tratamento', 'resolvida'];
    const { statusDenuncia } = req.body;

    if (!allowedStatuses.includes(statusDenuncia)) {
      return res.status(400).json({
        error: 'Status inválido. Use: aberta, em tratamento ou resolvida.',
      });
    }

    const denuncia = await Denuncia.findByPk(req.params.id);
    if (!denuncia) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }

    await denuncia.update({ statusDenuncia });
    return res.json({ denuncia });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar status da denúncia' });
  }
};

module.exports = {
  dashboardStats,
  listUsuarios,
  listAreas,
  listDenuncias,
  updateDenunciaStatus,
};
