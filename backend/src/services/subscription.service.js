const Subscription = require('../models/Subscription.model');
const User = require('../models/User.model');
const CharityContribution = require('../models/CharityContribution.model');
const paginate = require('../utils/pagination');
const httpError = require('../utils/httpError');
const {
  SUBSCRIPTION_FEE_INR,
  SUBSCRIPTION_DURATION_DAYS
} = require('../config/constants');

async function activateSubscription(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw httpError('User not found', 404);
  }

  if (
    user.subscriptionStatus === 'active' &&
    user.subscriptionExpiresAt &&
    user.subscriptionExpiresAt > new Date()
  ) {
    throw httpError('Subscription already active', 400);
  }

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + SUBSCRIPTION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  const subscription = await Subscription.create({
    userId,
    plan: 'monthly',
    amount: SUBSCRIPTION_FEE_INR,
    startDate,
    endDate,
    status: 'active'
  });

  user.subscriptionStatus = 'active';
  user.subscriptionExpiresAt = endDate;
  await user.save();

  const charityContributionAmount =
    SUBSCRIPTION_FEE_INR * (user.contributionPercentage / 100);

  if (user.charityId) {
    await CharityContribution.create({
      userId,
      charityId: user.charityId,
      amount: charityContributionAmount,
      source: 'subscription'
    });
  }

  return { subscription, subscriptionExpiresAt: endDate };
}

async function getSubscriptionHistory(userId, page, limit) {
  const filter = { userId };
  const total = await Subscription.countDocuments(filter);
  const query = Subscription.find(filter).sort({ createdAt: -1 });
  const subscriptions = await paginate(query, page, limit);

  return {
    subscriptions,
    total,
    page: Math.max(Number(page) || 1, 1),
    totalPages: Math.ceil(total / Math.max(Number(limit) || 20, 1))
  };
}

module.exports = {
  activateSubscription,
  getSubscriptionHistory
};
