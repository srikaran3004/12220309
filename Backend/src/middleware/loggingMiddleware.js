const { Log } = require('../utils/logger');

const loggingMiddleware = async (req, res, next) => {
  await Log(
    'backend',
    'info',
    'middleware',
    `Incoming request: ${req.method} ${req.originalUrl}`
  );
  next();
};

const errorLoggingMiddleware = async (err, req, res, next) => {
  await Log(
    'backend',
    'error',
    'middleware',
    `Error occurred: ${err.message}`
  );
  next(err);
};

module.exports = { loggingMiddleware, errorLoggingMiddleware }; 