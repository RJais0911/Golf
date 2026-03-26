const scoreService = require('../services/score.service');
const { sendSuccess } = require('../utils/response');

async function addScore(req, res, next) {
  try {
    const { score } = await scoreService.addScore(req.user.id, req.body.value);
    sendSuccess(res, 'Score added', { score }, 201);
  } catch (error) {
    next(error);
  }
}

async function getScores(req, res, next) {
  try {
    const result = await scoreService.getScores(req.user.id);
    sendSuccess(res, 'Scores fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

async function updateScore(req, res, next) {
  try {
    const { score } = await scoreService.updateScore(req.user.id, req.params.id, req.body.value);
    sendSuccess(res, 'Score updated', { score });
  } catch (error) {
    next(error);
  }
}

async function deleteScore(req, res, next) {
  try {
    await scoreService.deleteScore(req.user.id, req.params.id);
    sendSuccess(res, 'Score deleted');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addScore,
  getScores,
  updateScore,
  deleteScore
};
