const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const errors = err.inner.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ errors });
  }
};

module.exports = { validate };
