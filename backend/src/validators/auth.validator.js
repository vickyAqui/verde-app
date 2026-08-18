const yup = require('yup');

const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
});

const registerSchema = yup.object().shape({
  nome: yup.string().min(2, 'Mínimo 2 caracteres').required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
  cpf: yup.string().length(11, 'CPF deve ter 11 dígitos').nullable(),
  dataNasc: yup.date().nullable(),
});

module.exports = { loginSchema, registerSchema };
