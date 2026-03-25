const { REFRESH_COOKIE_NAME } = require('../config/constants');
const { NODE_ENV } = require('../config/env');
const authService = require('../services/auth.service');

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
    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user
    });
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const rawToken = req.cookies[REFRESH_COOKIE_NAME];
    if (!rawToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { accessToken } = await authService.refreshAccessToken(rawToken);
    return res.status(200).json({
      message: 'Token refreshed',
      accessToken
    });
  } catch (error) {
    clearRefreshCookie(res);
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.user.id);
    clearRefreshCookie(res);
    res.status(200).json({ message: 'Logged out' });
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
