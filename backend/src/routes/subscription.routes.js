const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const subscriptionController = require('../controllers/subscription.controller');

const router = express.Router();

function validateActivation(body) {
  const fields = ['cardNumber', 'cardHolder', 'expiry', 'cvv'];
  const errors = [];

  for (const field of fields) {
    if (!body[field] || typeof body[field] !== 'string' || !body[field].trim()) {
      errors.push({ message: `${field} is required`, field });
    }
  }

  return { value: body, errors };
}

router.use(verifyToken);
router.post('/activate', validate(validateActivation), subscriptionController.activate);
router.get('/history', subscriptionController.history);

module.exports = router;
