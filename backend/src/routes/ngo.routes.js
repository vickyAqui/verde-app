const express = require('express');
const { listONGs, getONG, createONG } = require('../controllers/ngo.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, listONGs);
router.get('/:id', authMiddleware, getONG);
router.post('/', authMiddleware, createONG);

module.exports = router;
