const StatusError = function (message, status = 400) {
  const error = new Error(message);
  error.name = 'StatusError';
  error.status = status;
  return error;
};

module.exports = StatusError;
