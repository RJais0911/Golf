const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

function validateSignup(body) {
  const errors = [];
  if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
    errors.push({ message: 'Name is required', field: 'name' });
  } else if (body.name.trim().length > 50) {
    errors.push({ message: 'Name must be 50 characters or fewer', field: 'name' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!body.email || typeof body.email !== 'string' || !emailRegex.test(body.email)) {
    errors.push({ message: 'Valid email is required', field: 'email' });
  }

  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
    errors.push({ message: 'Password must be at least 6 characters', field: 'password' });
  }

  return { value: body, errors };
}

function validateLogin(body) {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!body.email || typeof body.email !== 'string' || !emailRegex.test(body.email)) {
    errors.push({ message: 'Valid email is required', field: 'email' });
  }
  if (!body.password || typeof body.password !== 'string') {
    errors.push({ message: 'Password is required', field: 'password' });
  }
  return { value: body, errors };
}

router.post('/signup', authLimiter, validate(validateSignup), authController.signup);
router.post('/login', authLimiter, validate(validateLogin), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
