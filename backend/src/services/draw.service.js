const Draw = require('../models/Draw.model');
const Score = require('../models/Score.model');
const User = require('../models/User.model');
const Winner = require('../models/Winner.model');
const Subscription = require('../models/Subscription.model');
const CharityContribution = require('../models/CharityContribution.model');
const paginate = require('../utils/pagination');
const httpError = require('../utils/httpError');
const {
  DRAW_COOLDOWN_HOURS,
  DRAW_NUMBERS_COUNT,
  DRAW_POOL_SIZE,
  DRAW_WIN_THRESHOLD,
  PRIZE_POOL_PERCENTAGE,
  PRIZE_DISTRIBUTION
} = require('../config/constants');

function generateDrawNumbers() {
  const pool = Array.from({ length: DRAW_POOL_SIZE }, (_, index) => index + 1);
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
  }
  return pool.slice(0, DRAW_NUMBERS_COUNT);
}

async function calculatePrizePool(lastDrawCreatedAt) {
  const subscriptionFilter = {
    paymentStatus: 'paid',
    createdAt: lastDrawCreatedAt ? { $gt: lastDrawCreatedAt } : { $exists: true }
  };

  const subscriptionAgg = await Subscription.aggregate([
    { $match: subscriptionFilter },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const subscriptionRevenue = subscriptionAgg[0]?.total || 0;
  const previousDraw = await Draw.findOne().sort({ createdAt: -1 });
  const rolloverAmount = previousDraw?.rolloverAmount || 0;

  return {
    totalPool: subscriptionRevenue * (PRIZE_POOL_PERCENTAGE / 100) + rolloverAmount,
    previousRollover: rolloverAmount
  };
}

async function runDraw(triggeredBy) {
  const cooldownDate = new Date(Date.now() - DRAW_COOLDOWN_HOURS * 60 * 60 * 1000);
  const recentDraw = await Draw.findOne({ createdAt: { $gt: cooldownDate } }).sort({ createdAt: -1 });
  if (recentDraw) {
    throw httpError('A draw was already run within the last 24 hours', 400);
  }

  const previousDraw = await Draw.findOne().sort({ createdAt: -1 });
  const poolData = await calculatePrizePool(previousDraw?.createdAt || null);

  const draw = await Draw.create({
    numbers: generateDrawNumbers(),
    totalPool: poolData.totalPool,
    rolloverAmount: 0,
    drawDate: new Date(),
    status: 'pending',
    triggeredBy
  });

  const eligibleUsers = await Score.aggregate([
    { $match: { usedInDrawId: null } },
    { $group: { _id: '$userId', count: { $sum: 1 } } },
    { $match: { count: DRAW_NUMBERS_COUNT } }
  ]);

  const now = new Date();
  const matchBuckets = {
    3: [],
    4: [],
    5: []
  };

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
      matchBuckets[matchCount].push({ user, userScores });
    } else {
      await Score.updateMany(
        { _id: { $in: userScores.map((score) => score._id) } },
        { $set: { usedInDrawId: draw._id } }
      );
    }
  }

  let winnersCount = 0;
  let nextRolloverAmount = 0;

  for (const matchCount of [5, 4, 3]) {
    const winnersForMatch = matchBuckets[matchCount];
    const shareAmount = draw.totalPool * PRIZE_DISTRIBUTION[matchCount];

    if (matchCount === 5 && winnersForMatch.length === 0) {
      nextRolloverAmount += shareAmount;
      continue;
    }

    if (winnersForMatch.length === 0) {
      continue;
    }

    const payoutPerWinner = shareAmount / winnersForMatch.length;

    for (const entry of winnersForMatch) {
      const charityAmount = payoutPerWinner * (entry.user.contributionPercentage / 100);

      await Winner.create({
        userId: entry.user._id,
        drawId: draw._id,
        matchCount,
        payoutAmount: payoutPerWinner,
        charityAmount,
        status: 'pending'
      });

      if (entry.user.charityId) {
        await CharityContribution.create({
          userId: entry.user._id,
          charityId: entry.user.charityId,
          amount: charityAmount,
          source: 'winning'
        });
      }

      await Score.updateMany(
        { _id: { $in: entry.userScores.map((score) => score._id) } },
        { $set: { usedInDrawId: draw._id } }
      );

      winnersCount += 1;
    }
  }

  draw.status = 'completed';
  draw.completedAt = new Date();
  draw.rolloverAmount = nextRolloverAmount;
  await draw.save();

  return {
    draw: {
      id: draw._id,
      numbers: draw.numbers,
      totalPool: draw.totalPool,
      rolloverAmount: draw.rolloverAmount,
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
