const ShortUrl = require('../models/ShortUrl');
const { Log } = require('../utils/logger');
const { nanoid } = require('nanoid');
const moment = require('moment');
const geoip = require('geoip-lite');

// Helper to validate URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// POST /shorturls - Create short URL
exports.createShortUrl = async (req, res) => {
  const { url, validity, shortcode } = req.body;
  if (!url || !isValidUrl(url)) {
    await Log('backend', 'error', 'controller', 'Invalid or missing URL in request');
    return res.status(400).json({ error: 'Invalid URL' });
  }

  let code = shortcode;
  if (code) {
    // Validate custom shortcode
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(code)) {
      await Log('backend', 'warn', 'controller', 'Invalid custom shortcode format');
      return res.status(400).json({ error: 'Invalid custom shortcode format' });
    }
    const exists = await ShortUrl.shortcodeExists(code);
    if (exists) {
      await Log('backend', 'warn', 'controller', 'Custom shortcode already exists');
      return res.status(409).json({ error: 'Shortcode already exists' });
    }
  } else {
    // Generate unique shortcode
    let unique = false;
    while (!unique) {
      code = nanoid(6);
      unique = !(await ShortUrl.shortcodeExists(code));
    }
  }

  // Calculate expiry
  const minutes = validity && Number.isInteger(validity) && validity > 0 ? validity : 30;
  const expiry = moment().add(minutes, 'minutes').toDate();

  // Save to DB
  try {
    const shortUrl = await ShortUrl.create({
      originalUrl: url,
      shortcode: code,
      expiry,
    });
    await Log('backend', 'info', 'controller', `Short URL created: ${code}`);
    return res.status(201).json({
      shortLink: `${req.protocol}://${req.get('host')}/${code}`,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    await Log('backend', 'error', 'controller', `DB error: ${err.message}`);
    return res.status(500).json({ error: 'Failed to create short URL' });
  }
};

// GET /:shortcode - Redirect to original URL
exports.redirectShortUrl = async (req, res) => {
  const { shortcode } = req.params;
  try {
    const shortUrl = await ShortUrl.findByShortcode(shortcode);
    if (!shortUrl) {
      await Log('backend', 'warn', 'controller', `Shortcode not found: ${shortcode}`);
      return res.status(404).json({ error: 'Shortcode not found' });
    }
    if (shortUrl.isExpired()) {
      await Log('backend', 'warn', 'controller', `Shortcode expired: ${shortcode}`);
      return res.status(410).json({ error: 'Shortcode expired' });
    }
    // Update analytics
    const referrer = req.get('referer') || '';
    const ip = req.ip || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    const location = geo ? `${geo.city || ''}, ${geo.country || ''}` : '';
    const userAgent = req.get('user-agent') || '';
    shortUrl.clicks += 1;
    shortUrl.clickDetails.push({
      timestamp: new Date(),
      referrer,
      location,
      ipAddress: ip,
      userAgent,
    });
    await shortUrl.save();
    await Log('backend', 'info', 'controller', `Redirected: ${shortcode}`);
    return res.redirect(shortUrl.originalUrl);
  } catch (err) {
    await Log('backend', 'error', 'controller', `Redirect error: ${err.message}`);
    return res.status(500).json({ error: 'Failed to redirect' });
  }
};

// GET /shorturls/:shortcode - Get statistics
exports.getShortUrlStats = async (req, res) => {
  const { shortcode } = req.params;
  try {
    const shortUrl = await ShortUrl.findByShortcode(shortcode);
    if (!shortUrl) {
      await Log('backend', 'warn', 'controller', `Stats not found for shortcode: ${shortcode}`);
      return res.status(404).json({ error: 'Shortcode not found' });
    }
    return res.json({
      shortcode: shortUrl.shortcode,
      originalUrl: shortUrl.originalUrl,
      createdAt: shortUrl.createdAt,
      expiry: shortUrl.expiry,
      clicks: shortUrl.clicks,
      clickDetails: shortUrl.clickDetails,
    });
  } catch (err) {
    await Log('backend', 'error', 'controller', `Stats error: ${err.message}`);
    return res.status(500).json({ error: 'Failed to get statistics' });
  }
}; 