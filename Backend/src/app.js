const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const urlRoutes = require('./routes/urlRoutes');
const { loggingMiddleware } = require('./middleware/loggingMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: config.cors.origin, credentials: config.cors.credentials }));
app.use(helmet());
app.use(morgan('dev'));
app.use(loggingMiddleware);

// Routes
app.use('/', urlRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found', message: 'Route does not exist' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.name || 'InternalServerError', message: err.message || 'Something went wrong' });
});

module.exports = app; 