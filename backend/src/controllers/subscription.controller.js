const subscriptionService = require('../services/subscription.service');
const { sendSuccess } = require('../utils/response');

async function activate(req, res, next) {
  try {
    const result = await subscriptionService.activateSubscription(
      req.user.id,
      req.body.plan,
      req.body.paymentMethod || 'mock'
    );
    sendSuccess(res, 'Subscription activated', result);
  } catch (error) {
    next(error);
  }
}

async function cancel(req, res, next) {
  try {
    const result = await subscriptionService.cancelCurrentSubscription(req.user.id);
    sendSuccess(res, 'Subscription cancelled', result);
  } catch (error) {
    next(error);
  }
}

async function history(req, res, next) {
  try {
    const result = await subscriptionService.getSubscriptionHistory(
      req.user.id,
      req.query.page,
      req.query.limit
    );
    sendSuccess(res, 'Subscription history fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  activate,
  cancel,
  history
};
