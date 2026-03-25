const User = require('../models/User.model');
const CharityContribution = require('../models/CharityContribution.model');
const Draw = require('../models/Draw.model');
const Winner = require('../models/Winner.model');
const paginate = require('../utils/pagination');
const httpError = require('../utils/httpError');

async function getUsers(page, limit) {
  const filter = { role: 'user' };
  const total = await User.countDocuments(filter);
  const query = User.find(filter)
    .select('-password -refreshToken')
    .populate('charityId', 'name')
    .sort({ createdAt: -1 });
  const users = await paginate(query, page, limit);

  return {
    users,
    total,
    page: Math.max(Number(page) || 1, 1),
    totalPages: Math.ceil(total / Math.max(Number(limit) || 20, 1))
  };
}

async function updateUser(id, changes) {
  const updates = {};
  if (typeof changes.isActive === 'boolean') {
    updates.isActive = changes.isActive;
  }

  const user = await User.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  )
    .select('-password -refreshToken')
    .populate('charityId', 'name');

  if (!user) {
    throw httpError('User not found', 404);
  }

  return { user };
}

async function getContributions(page, limit) {
  const total = await CharityContribution.countDocuments();
  const query = CharityContribution.find()
    .populate('userId', 'name email')
    .populate('charityId', 'name')
    .sort({ createdAt: -1 });
  const contributions = await paginate(query, page, limit);

  return {
    contributions,
    total,
    page: Math.max(Number(page) || 1, 1),
    totalPages: Math.ceil(total / Math.max(Number(limit) || 20, 1))
  };
}

async function getAdminDashboardStats() {
  const [totalUsers, totalDraws, totalWinners, totalContributions] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Draw.countDocuments(),
    Winner.countDocuments(),
    CharityContribution.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
  ]);

  return {
    totalUsers,
    totalDraws,
    totalWinners,
    totalCharityContributions: totalContributions[0]?.total || 0
  };
}

module.exports = {
  getUsers,
  updateUser,
  getContributions,
  getAdminDashboardStats
};
