const mongoose = require('mongoose');
const User = require('../models/User.model');
const Charity = require('../models/Charity.model');
const Winner = require('../models/Winner.model');
const Score = require('../models/Score.model');
const paginate = require('../utils/pagination');
const httpError = require('../utils/httpError');

async function getProfile(userId) {
  const user = await User.findById(userId)
    .select('-password -refreshToken')
    .populate('charityId', 'name description');

  if (!user) {
    throw httpError('User not found', 404);
  }

  if (user.subscriptionExpiresAt && user.subscriptionExpiresAt < new Date()) {
    user.subscriptionStatus = 'expired';
    await user.save();
  }

  const [activeScores, totalWinningsAgg, participatedDraws] = await Promise.all([
    Score.countDocuments({ userId, usedInDrawId: null }),
    Winner.aggregate([
      { $match: { userId: user._id, status: { $in: ['approved', 'paid', 'pending'] } } },
      { $group: { _id: null, total: { $sum: '$payoutAmount' } } }
    ]),
    Score.distinct('usedInDrawId', { userId, usedInDrawId: { $ne: null } })
  ]);

  return {
    user: {
      ...user.toObject(),
      activeScoresCount: activeScores,
      drawParticipationCount: participatedDraws.length,
      totalWinnings: totalWinningsAgg[0]?.total || 0
    }
  };
}

async function updateProfile(userId, changes) {
  const updates = {};

  if (typeof changes.name === 'string') {
    updates.name = changes.name.trim();
  }

  if (typeof changes.contributionPercentage !== 'undefined') {
    updates.contributionPercentage = Number(changes.contributionPercentage);
  }

  if (typeof changes.charityId !== 'undefined') {
    if (!mongoose.Types.ObjectId.isValid(changes.charityId)) {
      throw httpError('Invalid charity ID', 400, 'charityId');
    }

    const charity = await Charity.findById(changes.charityId);
    if (!charity) {
      throw httpError('Charity not found', 404, 'charityId');
    }

    updates.charityId = charity._id;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  )
    .select('-password -refreshToken')
    .populate('charityId', 'name description');

  if (!user) {
    throw httpError('User not found', 404);
  }

  return { user };
}

async function getUserResults(userId, page, limit) {
  const filter = { userId };
  const total = await Winner.countDocuments(filter);
  const query = Winner.find(filter)
    .populate('drawId', 'numbers createdAt completedAt')
    .sort({ createdAt: -1 });
  const results = await paginate(query, page, limit);

  return {
    results,
    total,
    page: Math.max(Number(page) || 1, 1),
    totalPages: Math.ceil(total / Math.max(Number(limit) || 20, 1))
  };
}

module.exports = {
  getProfile,
  updateProfile,
  getUserResults
};
