const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  value: { type: Number, required: true, min: 1, max: 45 },
  usedInDrawId: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);
