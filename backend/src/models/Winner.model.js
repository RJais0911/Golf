const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  drawId: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true, index: true },
  matchCount: { type: Number, required: true },
  payoutAmount: { type: Number, required: true },
  charityAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },
  approvedAt: { type: Date, default: null },
  rejectedAt: { type: Date, default: null },
  paidAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Winner', winnerSchema);
