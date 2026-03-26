const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const subscriptionController = require('../controllers/subscription.controller');

const router = express.Router();

function validateCheckout(body) {
  const errors = [];
  if (!['monthly', 'yearly'].includes(body.plan)) {
    errors.push({ message: 'Plan must be monthly or yearly', field: 'plan' });
  }
  if (typeof body.paymentMethod !== 'undefined' && body.paymentMethod !== 'mock') {
    errors.push({ message: 'paymentMethod must be mock', field: 'paymentMethod' });
  }
  return { value: body, errors };
}

router.use(verifyToken);
router.post('/activate', validate(validateCheckout), subscriptionController.activate);
router.post('/cancel', subscriptionController.cancel);
router.get('/history', subscriptionController.history);

module.exports = router;
