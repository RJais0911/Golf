const mongoose = require('mongoose');
const Charity = require('../models/Charity.model');
const User = require('../models/User.model');
const httpError = require('../utils/httpError');

async function getCharities() {
  const charities = await Charity.find().sort({ name: 1 });
  return { charities };
}

async function selectCharity(userId, charityId) {
  if (!mongoose.Types.ObjectId.isValid(charityId)) {
    throw httpError('Invalid charity ID', 400, 'charityId');
  }

  const charity = await Charity.findById(charityId);
  if (!charity) {
    throw httpError('Charity not found', 404, 'charityId');
  }

  await User.findByIdAndUpdate(userId, { $set: { charityId } });
}

async function createCharity({ name, description }) {
  const charity = await Charity.create({
    name: name.trim(),
    description: description || ''
  });
  return { charity };
}

async function updateCharity(id, changes) {
  const updates = {};
  if (typeof changes.name === 'string') {
    updates.name = changes.name.trim();
  }
  if (typeof changes.description !== 'undefined') {
    updates.description = changes.description;
  }

  const charity = await Charity.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!charity) {
    throw httpError('Charity not found', 404);
  }

  return { charity };
}

async function deleteCharity(id) {
  const charity = await Charity.findById(id);
  if (!charity) {
    throw httpError('Charity not found', 404);
  }

  const usersUsingCharity = await User.countDocuments({ charityId: id });
  if (usersUsingCharity > 0) {
    throw httpError('Charity cannot be deleted while selected by users', 400);
  }

  await Charity.findByIdAndDelete(id);
}

module.exports = {
  getCharities,
  selectCharity,
  createCharity,
  updateCharity,
  deleteCharity
};
