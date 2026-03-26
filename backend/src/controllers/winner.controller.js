const winnerService = require('../services/winner.service');
const { sendSuccess } = require('../utils/response');

async function getWinners(req, res, next) {
  try {
    const result = await winnerService.getWinners(req.query.page, req.query.limit);
    sendSuccess(res, 'Winners fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

async function getWinnersByDraw(req, res, next) {
  try {
    const result = await winnerService.getWinnersByDraw(req.params.drawId);
    sendSuccess(res, 'Draw winners fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getWinners,
  getWinnersByDraw
};
