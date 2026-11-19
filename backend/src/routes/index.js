const express = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const areaRoutes = require('./area.routes');
const denunciasRoutes = require('./denuncia.routes');
const adminRoutes = require('./admin.routes');
const conteudoRoutes = require('./conteudo.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/areas', areaRoutes);
router.use('/denuncias', denunciasRoutes);
router.use('/conteudos', conteudoRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
