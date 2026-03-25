const charityService = require('../services/charity.service');

async function getCharities(req, res, next) {
  try {
    const result = await charityService.getCharities();
    res.status(200).json({
      message: 'Charities fetched successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function selectCharity(req, res, next) {
  try {
    await charityService.selectCharity(req.user.id, req.body.charityId);
    res.status(200).json({ message: 'Charity selected' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCharities,
  selectCharity
};
