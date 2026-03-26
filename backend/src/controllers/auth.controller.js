const { REFRESH_COOKIE_NAME } = require('../config/constants');
const { NODE_ENV } = require('../config/env');
const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response');

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict'
  });
}

async function signup(req, res, next) {
  try {
    await authService.signup(req.body);
    sendSuccess(res, 'Account created successfully', null, 201);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    setRefreshCookie(res, refreshToken);
    sendSuccess(res, 'Login successful', { accessToken, user });
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const rawToken = req.cookies[REFRESH_COOKIE_NAME];
    if (!rawToken) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }

    const { accessToken } = await authService.refreshAccessToken(rawToken);
    return sendSuccess(res, 'Token refreshed', { accessToken });
  } catch (error) {
    clearRefreshCookie(res);
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.user.id);
    clearRefreshCookie(res);
    sendSuccess(res, 'Logged out');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  login,
  refresh,
  logout
};
