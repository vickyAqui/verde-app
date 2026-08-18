const express = require('express');
const { listNotifications, markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notification.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, listNotifications);
router.put('/read-all', authMiddleware, markAllAsRead);
router.put('/:id/read', authMiddleware, markAsRead);
router.delete('/:id', authMiddleware, deleteNotification);

module.exports = router;
