const mongoose = require('mongoose');

const charityContributionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  charityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity', required: true },
  amount: { type: Number, required: true },
  source: { type: String, enum: ['subscription', 'winning'], required: true },
  subscriptionPlan: { type: String, enum: ['monthly', 'yearly', null], default: null },
  paymentReference: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CharityContribution', charityContributionSchema);
