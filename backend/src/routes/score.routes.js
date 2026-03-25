const express = require('express');
const { SCORE_MIN, SCORE_MAX } = require('../config/constants');
const { verifyToken } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const scoreController = require('../controllers/score.controller');

const router = express.Router();

function validateScore(body) {
  const errors = [];
  const value = Number(body.value);

  if (!Number.isInteger(value) || value < SCORE_MIN || value > SCORE_MAX) {
    errors.push({
      message: `Score must be an integer between ${SCORE_MIN} and ${SCORE_MAX}`,
      field: 'value'
    });
  }

  return {
    value: { value },
    errors
  };
}

router.use(verifyToken);
router.post('/', validate(validateScore), scoreController.addScore);
router.get('/', scoreController.getScores);
router.delete('/:id', scoreController.deleteScore);

module.exports = router;
