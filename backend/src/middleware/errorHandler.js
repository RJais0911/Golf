const { NODE_ENV } = require('../config/env');

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const response = {
    message: err.message || 'Internal server error'
  };

  if (err.field) {
    response.field = err.field;
  }

  if (NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}

module.exports = errorHandler;
