const express = require('express');
const {
  listContentTypes,
  listConteudos,
  getConteudo,
} = require('../controllers/conteudo.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.get('/tipos', authMiddleware, listContentTypes);
router.get('/', authMiddleware, listConteudos);
router.get('/:id', authMiddleware, getConteudo);

module.exports = router;
