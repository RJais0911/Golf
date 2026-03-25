const adminService = require('../services/admin.service');
const charityService = require('../services/charity.service');
const winnerService = require('../services/winner.service');

async function getUsers(req, res, next) {
  try {
    const result = await adminService.getUsers(req.query.page, req.query.limit);
    res.status(200).json({
      message: 'Users fetched successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const { user } = await adminService.updateUser(req.params.id, req.body);
    res.status(200).json({
      message: 'User updated',
      user
    });
  } catch (error) {
    next(error);
  }
}

async function createCharity(req, res, next) {
  try {
    const { charity } = await charityService.createCharity(req.body);
    res.status(201).json({
      message: 'Charity created',
      charity
    });
  } catch (error) {
    next(error);
  }
}

async function updateCharity(req, res, next) {
  try {
    const { charity } = await charityService.updateCharity(req.params.id, req.body);
    res.status(200).json({
      message: 'Charity updated',
      charity
    });
  } catch (error) {
    next(error);
  }
}

async function deleteCharity(req, res, next) {
  try {
    await charityService.deleteCharity(req.params.id);
    res.status(200).json({ message: 'Charity deleted' });
  } catch (error) {
    next(error);
  }
}

async function getContributions(req, res, next) {
  try {
    const result = await adminService.getContributions(req.query.page, req.query.limit);
    res.status(200).json({
      message: 'Contributions fetched successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function updateWinnerStatus(req, res, next) {
  try {
    const { winner } = await winnerService.markWinnerAsPaid(req.params.id);
    res.status(200).json({
      message: 'Winner marked as paid',
      winner
    });
  } catch (error) {
    next(error);
  }
}

async function getDashboardStats(req, res, next) {
  try {
    const stats = await adminService.getAdminDashboardStats();
    res.status(200).json({
      message: 'Admin dashboard fetched successfully',
      stats
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  updateUser,
  createCharity,
  updateCharity,
  deleteCharity,
  getContributions,
  updateWinnerStatus,
  getDashboardStats
};
