const express = require('express');
const { listAreas, getArea, createArea, updateArea, deleteArea } = require('../controllers/area.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, listAreas);
router.get('/:id', authMiddleware, getArea);
router.post('/', authMiddleware, createArea);
router.put('/:id', authMiddleware, updateArea);
router.delete('/:id', authMiddleware, deleteArea);

module.exports = router;
