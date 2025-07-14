const mongoose = require('mongoose');

const clickAnalyticsSchema = new mongoose.Schema({
  shortcodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShortUrl',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  referrer: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better performance
clickAnalyticsSchema.index({ shortcodeId: 1 });
clickAnalyticsSchema.index({ timestamp: -1 });

// Static method to get clicks by shortcode ID
clickAnalyticsSchema.statics.getClicksByShortcodeId = function(shortcodeId) {
  return this.find({ shortcodeId }).sort({ timestamp: -1 });
};

// Static method to get click count by shortcode ID
clickAnalyticsSchema.statics.getClickCountByShortcodeId = function(shortcodeId) {
  return this.countDocuments({ shortcodeId });
};

module.exports = mongoose.model('ClickAnalytics', clickAnalyticsSchema); 