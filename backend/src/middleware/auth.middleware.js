const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { JWT_ACCESS_SECRET } = require('../config/env');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, data: null, message: 'Forbidden' });
  }

  return next();
}

async function requireActiveSubscription(req, res, next) {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Unauthorized'
    });
  }

  const hasActiveSubscription =
    user.subscriptionStatus === 'active' &&
    user.subscriptionExpiresAt &&
    user.subscriptionExpiresAt > new Date();

  if (!hasActiveSubscription) {
    if (user.subscriptionExpiresAt && user.subscriptionExpiresAt < new Date()) {
      user.subscriptionStatus = 'expired';
      await user.save();
    }

    return res.status(403).json({
      success: false,
      data: null,
      message: 'Active subscription required'
    });
  }

  return next();
}

module.exports = {
  verifyToken,
  requireAdmin,
  requireActiveSubscription
};
