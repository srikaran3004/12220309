require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  environment: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener',
  },
  testServer: {
    baseUrl: 'http://20.244.56.144/evaluation-service',
    registrationUrl: 'http://20.244.56.144/evaluation-service/register',
    authUrl: 'http://20.244.56.144/evaluation-service/auth',
    logsUrl: 'http://20.244.56.144/evaluation-service/logs',
  },
  auth: {
    email: process.env.AUTH_EMAIL || '',
    name: process.env.AUTH_NAME || '',
    rollNo: process.env.AUTH_ROLL_NO || '',
    accessCode: process.env.AUTH_ACCESS_CODE || '',
    clientID: process.env.AUTH_CLIENT_ID || '',
    clientSecret: process.env.AUTH_CLIENT_SECRET || '',
  },
  shortener: {
    defaultValidity: 30,
    shortcodeLength: 6,
    maxCustomShortcodeLength: 20,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
};

module.exports = config; 