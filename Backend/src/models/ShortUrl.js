const mongoose = require('mongoose');

const clickDetailSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  referrer: String,
  location: String,
  ipAddress: String,
  userAgent: String
}, { _id: false });

const shortUrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortcode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  expiry: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  clicks: {
    type: Number,
    default: 0
  },
  clickDetails: [clickDetailSchema]
}, {
  timestamps: true
});

shortUrlSchema.index({ shortcode: 1 });
shortUrlSchema.index({ expiry: 1 });

shortUrlSchema.methods.isExpired = function() {
  return new Date() > this.expiry;
};

shortUrlSchema.statics.findByShortcode = function(shortcode) {
  return this.findOne({ shortcode });
};

shortUrlSchema.statics.shortcodeExists = function(shortcode) {
  return this.exists({ shortcode });
};

shortUrlSchema.statics.getExpiredUrls = function() {
  return this.find({ expiry: { $lt: new Date() } });
};

module.exports = mongoose.model('ShortUrl', shortUrlSchema); 