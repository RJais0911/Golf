const express = require('express');
const {
  CONTRIBUTION_MIN_PERCENT,
  CONTRIBUTION_MAX_PERCENT
} = require('../config/constants');
const { verifyToken } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const userController = require('../controllers/user.controller');

const router = express.Router();

function validateProfileUpdate(body) {
  const errors = [];

  if (typeof body.name !== 'undefined' && !String(body.name).trim()) {
    errors.push({ message: 'Name cannot be empty', field: 'name' });
  }

  if (typeof body.contributionPercentage !== 'undefined') {
    const value = Number(body.contributionPercentage);
    if (
      Number.isNaN(value) ||
      value < CONTRIBUTION_MIN_PERCENT ||
      value > CONTRIBUTION_MAX_PERCENT
    ) {
      errors.push({
        message: `Contribution percentage must be between ${CONTRIBUTION_MIN_PERCENT} and ${CONTRIBUTION_MAX_PERCENT}`,
        field: 'contributionPercentage'
      });
    }
  }

  return { value: body, errors };
}

router.use(verifyToken);
router.get('/profile', userController.getProfile);
router.patch('/profile', validate(validateProfileUpdate), userController.updateProfile);
router.get('/results', userController.getResults);

module.exports = router;
