const scoreService = require('../services/score.service');

async function addScore(req, res, next) {
  try {
    const { score } = await scoreService.addScore(req.user.id, req.body.value);
    res.status(201).json({
      message: 'Score added',
      score
    });
  } catch (error) {
    next(error);
  }
}

async function getScores(req, res, next) {
  try {
    const result = await scoreService.getScores(req.user.id);
    res.status(200).json({
      message: 'Scores fetched successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function deleteScore(req, res, next) {
  try {
    await scoreService.deleteScore(req.user.id, req.params.id);
    res.status(200).json({ message: 'Score deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addScore,
  getScores,
  deleteScore
};
