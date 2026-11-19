const express = require('express');
const { adminAuthMiddleware } = require('../middlewares/adminAuth');
const {
  dashboardStats,
  listUsuarios,
  listAreas,
  listDenuncias,
  updateDenunciaStatus,
} = require('../controllers/admin.controller');
const {
  listConteudos,
  createConteudo,
  updateConteudo,
  deleteConteudo,
} = require('../controllers/conteudo.controller');

const router = express.Router();

router.use(adminAuthMiddleware);

router.get('/dashboard', dashboardStats);
router.get('/usuarios', listUsuarios);
router.get('/areas', listAreas);
router.get('/denuncias', listDenuncias);
router.put('/denuncia/:id/status', updateDenunciaStatus);
router.get('/conteudos', listConteudos);
router.post('/conteudos', createConteudo);
router.put('/conteudos/:id', updateConteudo);
router.delete('/conteudos/:id', deleteConteudo);

module.exports = router;
