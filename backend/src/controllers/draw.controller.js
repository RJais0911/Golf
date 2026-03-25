const drawService = require('../services/draw.service');

async function runDraw(req, res, next) {
  try {
    const result = await drawService.runDraw(req.user.id);
    res.status(200).json({
      message: 'Draw completed',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function latest(req, res, next) {
  try {
    const result = await drawService.getLatestDraw();
    res.status(200).json({
      message: 'Latest draw fetched successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function history(req, res, next) {
  try {
    const result = await drawService.getDrawHistory(req.query.page, req.query.limit);
    res.status(200).json({
      message: 'Draw history fetched successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  runDraw,
  latest,
  history
};
