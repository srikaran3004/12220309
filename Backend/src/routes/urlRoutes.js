const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// Create short URL
router.post('/shorturls', urlController.createShortUrl);

// Redirect to original URL
router.get('/:shortcode', urlController.redirectShortUrl);

// Get statistics for a short URL
router.get('/shorturls/:shortcode', urlController.getShortUrlStats);

module.exports = router; 