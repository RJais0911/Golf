function httpError(message, status = 500, field) {
  const error = new Error(message);
  error.status = status;
  if (field) {
    error.field = field;
  }
  return error;
}

module.exports = httpError;
