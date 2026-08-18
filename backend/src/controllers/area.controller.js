const { Op } = require('sequelize');
const Area = require('../models/Area');
const User = require('../models/User');
const NGO = require('../models/NGO');

const listAreas = async (req, res) => {
  try {
    const { status, latitude, longitude, radius = 10 } = req.query;

    const where = {};
    if (status) where.status = status;

    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const r = parseFloat(radius) / 111;

      where.latitude = { [Op.between]: [lat - r, lat + r] };
      where.longitude = { [Op.between]: [lng - r, lng + r] };
    }

    const areas = await Area.findAll({
      where,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name'] },
        { model: NGO, as: 'ngo', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json({ areas });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar áreas' });
  }
};

const getArea = async (req, res) => {
  try {
    const area = await Area.findByPk(req.params.id, {
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name', 'avatar'] },
        { model: NGO, as: 'ngo' },
      ],
    });

    if (!area) {
      return res.status(404).json({ error: 'Área não encontrada' });
    }

    return res.json({ area });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar área' });
  }
};

const createArea = async (req, res) => {
  try {
    const { name, description, latitude, longitude, areaSize, vegetationType, imageUrl } = req.body;

    const area = await Area.create({
      name,
      description,
      latitude,
      longitude,
      areaSize,
      vegetationType,
      imageUrl,
      reportedBy: req.user.id,
    });

    return res.status(201).json({ area });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar área' });
  }
};

const updateArea = async (req, res) => {
  try {
    const area = await Area.findByPk(req.params.id);

    if (!area) {
      return res.status(404).json({ error: 'Área não encontrada' });
    }

    if (area.reportedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para editar' });
    }

    await area.update(req.body);

    return res.json({ area });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar área' });
  }
};

const deleteArea = async (req, res) => {
  try {
    const area = await Area.findByPk(req.params.id);

    if (!area) {
      return res.status(404).json({ error: 'Área não encontrada' });
    }

    if (area.reportedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para remover' });
    }

    await area.destroy();

    return res.json({ message: 'Área removida com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao remover área' });
  }
};

module.exports = { listAreas, getArea, createArea, updateArea, deleteArea };
