const express = require('express');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const winnerController = require('../controllers/winner.controller');

const router = express.Router();

router.use(verifyToken, requireAdmin);
router.get('/', winnerController.getWinners);
router.get('/:drawId', winnerController.getWinnersByDraw);

module.exports = router;
