const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err);

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return res.status(400).json({ errors });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: `${e.path} já está em uso` }));
    return res.status(409).json({ errors });
  }

  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Erro interno do servidor' });
};

module.exports = errorHandler;
