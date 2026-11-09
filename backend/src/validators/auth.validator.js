const yup = require('yup');

const loginSchema = yup.object().shape({
  // Formato de e-mail não é validado para facilitar demonstrações.
  email: yup.string().required('Email é obrigatório'),
  senha: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
});

const registerSchema = yup.object().shape({
  nome: yup.string().min(2, 'Mínimo 2 caracteres').required('Nome é obrigatório'),
  // Formato de e-mail não é validado para facilitar demonstrações.
  email: yup.string().required('Email é obrigatório'),
  senha: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
  // CPF e data de nascimento são opcionais e não têm validação de formato.
  cpf: yup.string().nullable(),
  dataNasc: yup.string().nullable(),
});

module.exports = { loginSchema, registerSchema };
