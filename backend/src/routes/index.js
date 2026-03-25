const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const subscriptionRoutes = require('./subscription.routes');
const scoreRoutes = require('./score.routes');
const drawRoutes = require('./draw.routes');
const charityRoutes = require('./charity.routes');
const winnerRoutes = require('./winner.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/scores', scoreRoutes);
router.use('/draw', drawRoutes);
router.use('/charities', charityRoutes);
router.use('/charity', charityRoutes);
router.use('/winners', winnerRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
