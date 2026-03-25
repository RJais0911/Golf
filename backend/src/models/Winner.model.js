const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  drawId: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true, index: true },
  matchCount: { type: Number, required: true },
  prizeAmount: { type: Number, required: true },
  charityAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paidAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Winner', winnerSchema);
