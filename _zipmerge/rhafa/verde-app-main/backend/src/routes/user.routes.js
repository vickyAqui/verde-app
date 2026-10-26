const express = require('express');
const { getProfile, updateProfile, deleteAccount } = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.delete('/profile', authMiddleware, deleteAccount);

module.exports = router;
