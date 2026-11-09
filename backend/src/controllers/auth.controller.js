const jwt = require('jsonwebtoken');
const { Usuario, Nivel_Usuario } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

const register = async (req, res) => {
  try {
    const { nome, email, senha, cpf, dataNasc } = req.body;

    // CPF e data de nascimento são aceitos sem validação de formato
    // temporariamente, para facilitar demonstrações.
    const cpfDigits = cpf ? String(cpf).replace(/\D/g, '') || null : null;
    const birthDate = dataNasc ? String(dataNasc).trim() : null;

    const existing = await Usuario.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const usuario = await Usuario.create({ idNivel_Usuario: 1, nome, email, senha, cpf: cpfDigits, dataNasc: birthDate });

    const usuarioSeguro = usuario.toJSON();
    delete usuarioSeguro.senha;

    const token = generateToken(usuario.idUsuario);

    return res.status(201).json({ usuario: usuarioSeguro, token, tipo: 'comum' });

  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({
      where: { email },
      include: [{ model: Nivel_Usuario, as: 'nivel', attributes: ['descricao'] }]
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const valid = await usuario.checkSenha(senha);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const tipo = usuario.nivel.descricao

    const usuarioSeguro = usuario.toJSON();
    delete usuarioSeguro.senha;

    const token = generateToken(usuario.idUsuario);

    return res.json({ usuario: usuarioSeguro, tipo, token });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

module.exports = { register, login };
