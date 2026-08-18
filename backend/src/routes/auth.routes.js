const express = require('express');
const { login, register } = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validator');
const { loginSchema, registerSchema } = require('../validators/auth.validator');

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);

module.exports = router;
