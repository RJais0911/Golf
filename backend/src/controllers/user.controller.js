const userService = require('../services/user.service');

async function getProfile(req, res, next) {
  try {
    const result = await userService.getProfile(req.user.id);
    res.status(200).json({
      message: 'Profile fetched successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { user } = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({
      message: 'Profile updated',
      user
    });
  } catch (error) {
    next(error);
  }
}

async function getResults(req, res, next) {
  try {
    const result = await userService.getUserResults(req.user.id, req.query.page, req.query.limit);
    res.status(200).json({
      message: 'Results fetched successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getResults
};
