const jwt = require('jsonwebtoken');
const { Usuario, Nivel_Usuario } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

const register = async (req, res) => {
  try {
    const { nome, email, senha, cpf, dataNasc } = req.body;

    // CPF e data de nascimento são aceitos sem validação de formato
    // temporariamente, para facilitar demonstrações. Valores que não
    // couberem no banco são gravados como nulos para não travar o cadastro.
    const cpfRaw = cpf ? String(cpf).replace(/\D/g, '') : '';
    let cpfDigits = cpfRaw.length === 11 ? cpfRaw : null;

    if (cpfDigits) {
      const cpfEmUso = await Usuario.findOne({ where: { cpf: cpfDigits } });
      if (cpfEmUso) cpfDigits = null;
    }

    const birthRaw = dataNasc ? String(dataNasc).trim() : '';
    let birthDate = null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(birthRaw)) {
      const [year, month, day] = birthRaw.split('-').map(Number);
      const parsed = new Date(Date.UTC(year, month - 1, day));

      if (
        parsed.getUTCFullYear() === year &&
        parsed.getUTCMonth() === month - 1 &&
        parsed.getUTCDate() === day
      ) {
        birthDate = birthRaw;
      }
    }

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
