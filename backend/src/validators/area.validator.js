const yup = require('yup');

const areaSchema = yup.object().shape({
  name: yup.string().min(3, 'Mínimo 3 caracteres').required('Nome é obrigatório'),
  description: yup.string().nullable(),
  latitude: yup.number().required('Latitude é obrigatória'),
  longitude: yup.number().required('Longitude é obrigatória'),
  areaSize: yup.number().positive().nullable(),
  vegetationType: yup.string().oneOf(['forest', 'savanna', 'mangrove', 'other']).nullable(),
  imageUrl: yup.string().url().nullable(),
});

module.exports = { areaSchema };
