const User = require('../models/User');
const Area = require('../models/Area');
const NGO = require('../models/NGO');

const dashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalAreas = await Area.count();
    const pendingNGOs = await NGO.count({ where: { status: 'pending' } });
    const approvedNGOs = await NGO.count({ where: { status: 'approved' } });
    const areasInProgress = await Area.count({ where: { status: 'in_progress' } });
    const areasReforested = await Area.count({ where: { status: 'reforested' } });

    return res.json({
      stats: {
        totalUsers,
        totalAreas,
        pendingNGOs,
        approvedNGOs,
        areasInProgress,
        areasReforested,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

const listAreas = async (req, res) => {
  try {
    const areas = await Area.findAll({ order: [['createdAt', 'DESC']] });
    return res.json({ areas });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar áreas' });
  }
};

const listNGOs = async (req, res) => {
  try {
    const ngos = await NGO.findAll({ order: [['createdAt', 'DESC']] });
    return res.json({ ngos });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar ONGs' });
  }
};

const approveNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByPk(req.params.id);
    if (!ngo) return res.status(404).json({ error: 'ONG não encontrada' });

    await ngo.update({ status: 'approved' });

    return res.json({ ngo });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao aprovar ONG' });
  }
};

const rejectNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByPk(req.params.id);
    if (!ngo) return res.status(404).json({ error: 'ONG não encontrada' });

    await ngo.update({ status: 'rejected' });

    return res.json({ ngo });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao rejeitar ONG' });
  }
};

module.exports = { dashboardStats, listUsers, listAreas, listNGOs, approveNGO, rejectNGO };
