const Score = require('../models/Score.model');
const User = require('../models/User.model');
const httpError = require('../utils/httpError');
const { SCORE_LIMIT } = require('../config/constants');

async function ensureActiveSubscription(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw httpError('User not found', 404);
  }

  const isActive =
    user.subscriptionStatus === 'active' &&
    user.subscriptionExpiresAt &&
    user.subscriptionExpiresAt > new Date();

  if (!isActive) {
    if (user.subscriptionExpiresAt && user.subscriptionExpiresAt < new Date()) {
      user.subscriptionStatus = 'expired';
      await user.save();
    }
    throw httpError('Active subscription required to add scores', 403);
  }

  return user;
}

async function addScore(userId, value) {
  await ensureActiveSubscription(userId);

  const count = await Score.countDocuments({ userId, usedInDrawId: null });
  if (count >= SCORE_LIMIT) {
    const oldestScore = await Score.findOne({ userId, usedInDrawId: null }).sort({ createdAt: 1 });
    if (oldestScore) {
      await Score.findByIdAndDelete(oldestScore._id);
    }
  }

  const score = await Score.create({
    userId,
    value,
    usedInDrawId: null
  });

  return { score };
}

async function getScores(userId) {
  const scores = await Score.find({ userId, usedInDrawId: null }).sort({ createdAt: 1 });
  return { scores, count: scores.length };
}

async function deleteScore(userId, scoreId) {
  const score = await Score.findOne({ _id: scoreId, userId });
  if (!score) {
    throw httpError('Score not found', 404);
  }

  if (score.usedInDrawId) {
    throw httpError('Cannot delete a score that has been used in a draw', 400);
  }

  await Score.findByIdAndDelete(scoreId);
}

async function updateScore(userId, scoreId, value) {
  const score = await Score.findOne({ _id: scoreId, userId });
  if (!score) {
    throw httpError('Score not found', 404);
  }

  if (score.usedInDrawId) {
    throw httpError('Cannot edit a score that has been used in a draw', 400);
  }

  score.value = value;
  await score.save();

  return { score };
}

module.exports = {
  addScore,
  getScores,
  deleteScore,
  updateScore
};
