const Subscription = require('../models/Subscription.model');
const User = require('../models/User.model');
const CharityContribution = require('../models/CharityContribution.model');
const paginate = require('../utils/pagination');
const httpError = require('../utils/httpError');
const {
  SUBSCRIPTION_FEE_INR,
  SUBSCRIPTION_DURATION_DAYS,
  YEARLY_SUBSCRIPTION_FEE_INR,
  YEARLY_SUBSCRIPTION_DURATION_DAYS
} = require('../config/constants');

function getPlanConfig(plan) {
  if (plan === 'yearly') {
    return {
      plan: 'yearly',
      amount: YEARLY_SUBSCRIPTION_FEE_INR,
      durationDays: YEARLY_SUBSCRIPTION_DURATION_DAYS
    };
  }

  return {
    plan: 'monthly',
    amount: SUBSCRIPTION_FEE_INR,
    durationDays: SUBSCRIPTION_DURATION_DAYS
  };
}

function buildMockPaymentReference(plan) {
  return `mock_${plan}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function activateSubscription(userId, plan, paymentMethod = 'mock') {
  const user = await User.findById(userId);
  if (!user) {
    throw httpError('User not found', 404);
  }

  const planConfig = getPlanConfig(plan);
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + planConfig.durationDays * 24 * 60 * 60 * 1000);
  const paymentReference = buildMockPaymentReference(planConfig.plan);

  await Subscription.updateMany(
    { userId, status: 'active' },
    { $set: { status: 'expired', updatedAt: new Date() } }
  );

  const subscription = await Subscription.create({
    userId,
    plan: planConfig.plan,
    amount: planConfig.amount,
    startDate,
    endDate,
    status: 'active',
    paymentReference,
    paymentStatus: 'paid'
  });

  user.subscriptionPlan = planConfig.plan;
  user.subscriptionStatus = 'active';
  user.subscriptionExpiresAt = endDate;
  user.subscriptionPaymentReference = paymentReference;
  await user.save();

  const charityContributionAmount = planConfig.amount * (user.contributionPercentage / 100);
  if (user.charityId) {
    await CharityContribution.create({
      userId,
      charityId: user.charityId,
      amount: charityContributionAmount,
      source: 'subscription'
    });
  }

  return {
    subscription,
    subscriptionExpiresAt: endDate,
    paymentMethod
  };
}

async function cancelCurrentSubscription(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw httpError('User not found', 404);
  }

  const subscription = await Subscription.findOne({ userId, status: 'active' }).sort({ createdAt: -1 });
  if (!subscription) {
    throw httpError('No active subscription found', 404);
  }

  subscription.status = 'cancelled';
  await subscription.save();

  user.subscriptionStatus = 'cancelled';
  await user.save();

  return { subscription };
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

async function getAllSubscriptions(page, limit) {
  const total = await Subscription.countDocuments();
  const query = Subscription.find()
    .populate('userId', 'name email subscriptionStatus subscriptionPlan')
    .sort({ createdAt: -1 });
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
  cancelCurrentSubscription,
  getSubscriptionHistory,
  getAllSubscriptions,
  getPlanConfig
};
