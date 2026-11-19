const express = require('express');
const { adminAuthMiddleware } = require('../middlewares/adminAuth');
const {
  dashboardStats,
  listUsuarios,
  listAreas,
  listDenuncias,
  updateDenunciaStatus,
} = require('../controllers/admin.controller');

const router = express.Router();

router.use(adminAuthMiddleware);

router.get('/dashboard', dashboardStats);
router.get('/usuarios', listUsuarios);
router.get('/areas', listAreas);
router.get('/denuncias', listDenuncias);
router.put('/denuncia/:id/status', updateDenunciaStatus);

module.exports = router;
