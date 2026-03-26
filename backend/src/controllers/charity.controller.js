const charityService = require('../services/charity.service');
const { sendSuccess } = require('../utils/response');

async function getCharities(req, res, next) {
  try {
    const result = await charityService.getCharities();
    sendSuccess(res, 'Charities fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

async function selectCharity(req, res, next) {
  try {
    await charityService.selectCharity(req.user.id, req.body.charityId);
    sendSuccess(res, 'Charity selected');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCharities,
  selectCharity
};
