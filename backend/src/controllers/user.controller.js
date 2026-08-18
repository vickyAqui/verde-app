const User = require('../models/User');

const getProfile = async (req, res) => {
  return res.json({ user: req.user });
};

const updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'avatar', 'latitude', 'longitude'];
    const updates = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await req.user.update(updates);

    return res.json({ user: req.user });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await req.user.destroy();
    return res.json({ message: 'Conta removida com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao remover conta' });
  }
};

module.exports = { getProfile, updateProfile, deleteAccount };
