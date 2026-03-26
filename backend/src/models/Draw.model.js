const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  numbers: { type: [Number], required: true },
  totalPool: { type: Number, required: true, default: 0 },
  rolloverAmount: { type: Number, required: true, default: 0 },
  drawDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Draw', drawSchema);
