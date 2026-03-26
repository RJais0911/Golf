const drawService = require('../services/draw.service');
const { sendSuccess } = require('../utils/response');

async function runDraw(req, res, next) {
  try {
    const result = await drawService.runDraw(req.user.id);
    sendSuccess(res, 'Draw completed', result);
  } catch (error) {
    next(error);
  }
}

async function latest(req, res, next) {
  try {
    const result = await drawService.getLatestDraw();
    sendSuccess(res, 'Latest draw fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

async function history(req, res, next) {
  try {
    const result = await drawService.getDrawHistory(req.query.page, req.query.limit);
    sendSuccess(res, 'Draw history fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  runDraw,
  latest,
  history
};
