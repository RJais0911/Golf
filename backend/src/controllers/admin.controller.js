const adminService = require('../services/admin.service');
const charityService = require('../services/charity.service');
const winnerService = require('../services/winner.service');
const subscriptionService = require('../services/subscription.service');
const { sendSuccess } = require('../utils/response');

async function getUsers(req, res, next) {
  try {
    const result = await adminService.getUsers(req.query.page, req.query.limit);
    sendSuccess(res, 'Users fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const { user } = await adminService.updateUser(req.params.id, req.body);
    sendSuccess(res, 'User updated', { user });
  } catch (error) {
    next(error);
  }
}

async function getSubscriptions(req, res, next) {
  try {
    const result = await subscriptionService.getAllSubscriptions(req.query.page, req.query.limit);
    sendSuccess(res, 'Subscriptions fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

async function createCharity(req, res, next) {
  try {
    const { charity } = await charityService.createCharity(req.body);
    sendSuccess(res, 'Charity created', { charity }, 201);
  } catch (error) {
    next(error);
  }
}

async function updateCharity(req, res, next) {
  try {
    const { charity } = await charityService.updateCharity(req.params.id, req.body);
    sendSuccess(res, 'Charity updated', { charity });
  } catch (error) {
    next(error);
  }
}

async function deleteCharity(req, res, next) {
  try {
    await charityService.deleteCharity(req.params.id);
    sendSuccess(res, 'Charity deleted');
  } catch (error) {
    next(error);
  }
}

async function getContributions(req, res, next) {
  try {
    const result = await adminService.getContributions(req.query.page, req.query.limit);
    sendSuccess(res, 'Contributions fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

async function updateWinnerStatus(req, res, next) {
  try {
    const { winner } = await winnerService.updateWinnerStatus(req.params.id, req.body.status);
    sendSuccess(res, `Winner marked as ${req.body.status}`, { winner });
  } catch (error) {
    next(error);
  }
}

async function getDashboardStats(req, res, next) {
  try {
    const stats = await adminService.getAdminDashboardStats();
    sendSuccess(res, 'Admin dashboard fetched successfully', { stats });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  updateUser,
  getSubscriptions,
  createCharity,
  updateCharity,
  deleteCharity,
  getContributions,
  updateWinnerStatus,
  getDashboardStats
};
