const express = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const areaRoutes = require('./area.routes');
const ngoRoutes = require('./ngo.routes');
const notificationRoutes = require('./notification.routes');
const adminRoutes = require('./admin.routes');
const uploadRoutes = require('./upload.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/areas', areaRoutes);
router.use('/ngos', ngoRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
