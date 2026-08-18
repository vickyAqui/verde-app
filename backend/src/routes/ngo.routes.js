const express = require('express');
const { listNGOs, getNGO, connectWithNGO } = require('../controllers/ngo.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, listNGOs);
router.get('/:id', authMiddleware, getNGO);
router.post('/:id/connect', authMiddleware, connectWithNGO);

module.exports = router;
