function sendSuccess(res, message, data = null, status = 200) {
  return res.status(status).json({
    success: true,
    data,
    message
  });
}

module.exports = {
  sendSuccess
};
