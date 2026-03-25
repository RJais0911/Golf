const subscriptionService = require('../services/subscription.service');

async function activate(req, res, next) {
  try {
    const result = await subscriptionService.activateSubscription(req.user.id);
    res.status(200).json({
      message: 'Subscription activated',
      ...result
    });
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
    res.status(200).json({
      message: 'Subscription history fetched successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  activate,
  history
};
