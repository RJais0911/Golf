const Winner = require('../models/Winner.model');
const paginate = require('../utils/pagination');
const httpError = require('../utils/httpError');

async function getWinners(page, limit) {
  const total = await Winner.countDocuments();
  const query = Winner.find()
    .populate('userId', 'name email')
    .populate('drawId', 'numbers createdAt')
    .sort({ createdAt: -1 });
  const winners = await paginate(query, page, limit);

  return {
    winners,
    total,
    page: Math.max(Number(page) || 1, 1),
    totalPages: Math.ceil(total / Math.max(Number(limit) || 20, 1))
  };
}

async function getWinnersByDraw(drawId) {
  const winners = await Winner.find({ drawId })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  return { winners };
}

async function markWinnerAsPaid(id) {
  const winner = await Winner.findById(id);
  if (!winner) {
    throw httpError('Winner not found', 404);
  }

  if (winner.status === 'paid') {
    throw httpError('Winner already marked as paid', 400);
  }

  winner.status = 'paid';
  winner.paidAt = new Date();
  await winner.save();

  return { winner };
}

module.exports = {
  getWinners,
  getWinnersByDraw,
  markWinnerAsPaid
};
