const express = require('express');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const drawController = require('../controllers/draw.controller');

const router = express.Router();

router.post('/run', verifyToken, requireAdmin, drawController.runDraw);
router.get('/latest', verifyToken, drawController.latest);
router.get('/history', verifyToken, requireAdmin, drawController.history);

module.exports = router;
