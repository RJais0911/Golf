const winnerService = require('../services/winner.service');

async function getWinners(req, res, next) {
  try {
    const result = await winnerService.getWinners(req.query.page, req.query.limit);
    res.status(200).json({
      message: 'Winners fetched successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function getWinnersByDraw(req, res, next) {
  try {
    const result = await winnerService.getWinnersByDraw(req.params.drawId);
    res.status(200).json({
      message: 'Draw winners fetched successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getWinners,
  getWinnersByDraw
};
