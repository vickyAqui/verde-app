const jwt = require('jsonwebtoken');
const { Usuario, UsuarioComum, Admin } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

const register = async (req, res) => {
  try {
    const { nome, email, senha, cpf, dataNasc } = req.body;

    const existing = await Usuario.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const usuario = await Usuario.create({ nome, email, senha });

    if (cpf) {
      await UsuarioComum.create({ idUsuario: usuario.idUsuario, cpf, dataNasc });
    }

    const token = generateToken(usuario.idUsuario);

    return res.status(201).json({ usuario, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const valid = await usuario.checkSenha(senha);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const admin = await Admin.findOne({ where: { idUsuario: usuario.idUsuario } });
    const comum = await UsuarioComum.findOne({ where: { idUsuario: usuario.idUsuario } });

    const token = generateToken(usuario.idUsuario);

    return res.json({
      usuario,
      tipo: admin ? 'admin' : 'comum',
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

module.exports = { register, login };
