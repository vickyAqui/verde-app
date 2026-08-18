const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user.id);

    return res.status(201).json({ user, token });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const valid = await user.checkPassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken(user.id);

    return res.json({ user, token });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json({ message: 'Email de recuperação enviado' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
};

const resetPassword = async (req, res) => {
  try {
    return res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
