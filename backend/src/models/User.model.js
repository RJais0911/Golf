const mongoose = require('mongoose');
const {
  CONTRIBUTION_DEFAULT_PERCENT,
  CONTRIBUTION_MIN_PERCENT,
  CONTRIBUTION_MAX_PERCENT
} = require('../config/constants');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscriptionStatus: { type: String, enum: ['active', 'inactive', 'expired'], default: 'inactive' },
  subscriptionExpiresAt: { type: Date, default: null },
  charityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity', default: null },
  contributionPercentage: {
    type: Number,
    default: CONTRIBUTION_DEFAULT_PERCENT,
    min: CONTRIBUTION_MIN_PERCENT,
    max: CONTRIBUTION_MAX_PERCENT
  },
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function updateUserMetadata(next) {
  this.updatedAt = new Date();
  if (this.subscriptionExpiresAt && this.subscriptionExpiresAt < new Date()) {
    this.subscriptionStatus = 'expired';
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
