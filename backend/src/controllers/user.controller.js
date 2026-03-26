const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/response');

async function getProfile(req, res, next) {
  try {
    const result = await userService.getProfile(req.user.id);
    sendSuccess(res, 'Profile fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { user } = await userService.updateProfile(req.user.id, req.body);
    sendSuccess(res, 'Profile updated', { user });
  } catch (error) {
    next(error);
  }
}

async function getResults(req, res, next) {
  try {
    const result = await userService.getUserResults(req.user.id, req.query.page, req.query.limit);
    sendSuccess(res, 'Results fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getResults
};
