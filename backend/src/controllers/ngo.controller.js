const NGO = require('../models/NGO');
const Connection = require('../models/Connection');
const Notification = require('../models/Notification');

const listNGOs = async (req, res) => {
  try {
    const ngos = await NGO.findAll({
      where: { status: 'approved' },
      order: [['name', 'ASC']],
    });

    return res.json({ ngos });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar ONGs' });
  }
};

const getNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByPk(req.params.id);

    if (!ngo) {
      return res.status(404).json({ error: 'ONG não encontrada' });
    }

    return res.json({ ngo });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar ONG' });
  }
};

const connectWithNGO = async (req, res) => {
  try {
    const { message } = req.body;
    const ngo = await NGO.findByPk(req.params.id);

    if (!ngo) {
      return res.status(404).json({ error: 'ONG não encontrada' });
    }

    const existing = await Connection.findOne({
      where: { userId: req.user.id, ngoId: ngo.id },
    });

    if (existing) {
      return res.status(409).json({ error: 'Conexão já estabelecida' });
    }

    const connection = await Connection.create({
      userId: req.user.id,
      ngoId: ngo.id,
      message,
    });

    await Notification.create({
      userId: req.user.id,
      title: 'Conexão solicitada',
      message: `Sua conexão com ${ngo.name} foi enviada.`,
      type: 'ngo_connection',
      data: { connectionId: connection.id, ngoId: ngo.id },
    });

    return res.status(201).json({ connection });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao conectar com ONG' });
  }
};

module.exports = { listNGOs, getNGO, connectWithNGO };
