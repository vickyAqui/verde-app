const express = require('express');
const { login, register, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validator');
const { loginSchema, registerSchema } = require('../validators/auth.validator');

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
