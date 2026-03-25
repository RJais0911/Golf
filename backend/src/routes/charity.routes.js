const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const charityController = require('../controllers/charity.controller');

const router = express.Router();

function validateSelection(body) {
  const errors = [];
  if (!body.charityId || typeof body.charityId !== 'string') {
    errors.push({ message: 'charityId is required', field: 'charityId' });
  }
  return { value: body, errors };
}

router.get('/', verifyToken, charityController.getCharities);
router.post('/select', verifyToken, validate(validateSelection), charityController.selectCharity);

module.exports = router;
