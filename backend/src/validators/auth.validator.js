const yup = require('yup');

const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
});

const registerSchema = yup.object().shape({
  name: yup.string().min(2, 'Mínimo 2 caracteres').required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
  phone: yup.string().nullable(),
});

module.exports = { loginSchema, registerSchema };
