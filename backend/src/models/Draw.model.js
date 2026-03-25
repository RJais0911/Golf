const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  numbers: { type: [Number], required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Draw', drawSchema);
