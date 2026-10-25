const express = require('express');
const { listProjetos, getProjeto, createProjeto, updateProjeto, deleteProjeto } = require('../controllers/projeto.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, listProjetos);
router.get('/:id', authMiddleware, getProjeto);
router.post('/', authMiddleware, createProjeto);
router.put('/:id', authMiddleware, updateProjeto);
router.delete('/:id', authMiddleware, deleteProjeto);

module.exports = router;
