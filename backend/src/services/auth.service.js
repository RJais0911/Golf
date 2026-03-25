const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const {
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY
} = require('../config/constants');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require('../config/env');
const httpError = require('../utils/httpError');

const SALT_ROUNDS = 12;

function buildUserPayload(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionExpiresAt: user.subscriptionExpiresAt,
    charityId: user.charityId,
    contributionPercentage: user.contributionPercentage
  };
}

function generateAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY
  });
}

async function signup({ name, email, password }) {
  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw httpError('Email already registered', 409, 'email');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword
  });
}

async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase().trim(), isActive: true });
  if (!user) {
    throw httpError('Invalid credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw httpError('Invalid credentials', 401);
  }

  if (user.subscriptionExpiresAt && user.subscriptionExpiresAt < new Date()) {
    user.subscriptionStatus = 'expired';
    await user.save();
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: buildUserPayload(user)
  };
}

async function refreshAccessToken(rawToken) {
  let decoded;
  try {
    decoded = jwt.verify(rawToken, JWT_REFRESH_SECRET);
  } catch (error) {
    throw httpError('Unauthorized', 401);
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.refreshToken) {
    throw httpError('Unauthorized', 401);
  }

  const isTokenValid = await bcrypt.compare(rawToken, user.refreshToken);
  if (!isTokenValid) {
    user.refreshToken = null;
    await user.save();
    throw httpError('Unauthorized', 401);
  }

  return { accessToken: generateAccessToken(user) };
}

async function logout(userId) {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
}

module.exports = {
  signup,
  login,
  refreshAccessToken,
  logout
};
