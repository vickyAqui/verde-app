const express = require('express');
const { adminAuthMiddleware } = require('../middlewares/adminAuth');
const {
  dashboardStats,
  listUsers,
  listAreas,
  listNGOs,
  approveNGO,
  rejectNGO,
} = require('../controllers/admin.controller');

const router = express.Router();

router.use(adminAuthMiddleware);

router.get('/dashboard', dashboardStats);
router.get('/users', listUsers);
router.get('/areas', listAreas);
router.get('/ngos', listNGOs);
router.put('/ngos/:id/approve', approveNGO);
router.put('/ngos/:id/reject', rejectNGO);

module.exports = router;
