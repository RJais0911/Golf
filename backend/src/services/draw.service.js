const Draw = require('../models/Draw.model');
const Score = require('../models/Score.model');
const User = require('../models/User.model');
const Winner = require('../models/Winner.model');
const CharityContribution = require('../models/CharityContribution.model');
const paginate = require('../utils/pagination');
const httpError = require('../utils/httpError');
const {
  DRAW_COOLDOWN_HOURS,
  DRAW_NUMBERS_COUNT,
  DRAW_POOL_SIZE,
  DRAW_WIN_THRESHOLD,
  PRIZE_AMOUNTS
} = require('../config/constants');

function generateDrawNumbers() {
  const pool = Array.from({ length: DRAW_POOL_SIZE }, (_, index) => index + 1);
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
  }
  return pool.slice(0, DRAW_NUMBERS_COUNT);
}

async function runDraw(triggeredBy) {
  const cooldownDate = new Date(Date.now() - DRAW_COOLDOWN_HOURS * 60 * 60 * 1000);
  const recentDraw = await Draw.findOne({ createdAt: { $gt: cooldownDate } }).sort({ createdAt: -1 });
  if (recentDraw) {
    throw httpError('A draw was already run within the last 24 hours', 400);
  }

  const draw = await Draw.create({
    numbers: generateDrawNumbers(),
    status: 'pending',
    triggeredBy
  });

  const eligibleUsers = await Score.aggregate([
    { $match: { usedInDrawId: null } },
    { $group: { _id: '$userId', count: { $sum: 1 } } },
    { $match: { count: DRAW_NUMBERS_COUNT } }
  ]);

  let winnersCount = 0;
  const now = new Date();

  for (const candidate of eligibleUsers) {
    const user = await User.findOne({
      _id: candidate._id,
      subscriptionStatus: 'active',
      subscriptionExpiresAt: { $gt: now }
    });

    if (!user) {
      continue;
    }

    const userScores = await Score.find({ userId: user._id, usedInDrawId: null }).sort({ createdAt: 1 });
    if (userScores.length !== DRAW_NUMBERS_COUNT) {
      continue;
    }

    const scoreValues = userScores.map((score) => score.value);
    const matchCount = scoreValues.filter((value) => draw.numbers.includes(value)).length;

    if (matchCount >= DRAW_WIN_THRESHOLD) {
      const prizeAmount = PRIZE_AMOUNTS[matchCount];
      const charityAmount = prizeAmount * (user.contributionPercentage / 100);

      await Winner.create({
        userId: user._id,
        drawId: draw._id,
        matchCount,
        prizeAmount,
        charityAmount,
        status: 'pending'
      });

      if (user.charityId) {
        await CharityContribution.create({
          userId: user._id,
          charityId: user.charityId,
          amount: charityAmount,
          source: 'winning'
        });
      }

      winnersCount += 1;
    }

    await Score.updateMany(
      { _id: { $in: userScores.map((score) => score._id) } },
      { $set: { usedInDrawId: draw._id } }
    );
  }

  draw.status = 'completed';
  draw.completedAt = new Date();
  await draw.save();

  return {
    draw: {
      id: draw._id,
      numbers: draw.numbers,
      status: draw.status,
      completedAt: draw.completedAt
    },
    winnersCount
  };
}

async function getLatestDraw() {
  const draw = await Draw.findOne().sort({ createdAt: -1 });
  if (!draw) {
    throw httpError('No draws have been run yet', 404);
  }
  return { draw };
}

async function getDrawHistory(page, limit) {
  const total = await Draw.countDocuments();
  const query = Draw.find().sort({ createdAt: -1 });
  const draws = await paginate(query, page, limit);

  return {
    draws,
    total,
    page: Math.max(Number(page) || 1, 1),
    totalPages: Math.ceil(total / Math.max(Number(limit) || 20, 1))
  };
}

module.exports = {
  runDraw,
  getLatestDraw,
  getDrawHistory,
  generateDrawNumbers
};
