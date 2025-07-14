const mongoose = require('mongoose');
const config = require('../config');
const { Log } = require('../utils/logger');

class Database {
  constructor() {
    this.isConnected = false;
  }

  /**
   * Connect to MongoDB
   */
  async connect() {
    try {
      await mongoose.connect(config.mongodb.uri); // Removed deprecated options

      this.isConnected = true;
      await Log('backend', 'info', 'db', 'MongoDB connected successfully');

      // Handle connection events
      mongoose.connection.on('error', async (error) => {
        await Log('backend', 'error', 'db', `MongoDB connection error: ${error.message}`);
      });

      mongoose.connection.on('disconnected', async () => {
        this.isConnected = false;
        await Log('backend', 'warn', 'db', 'MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', async () => {
        this.isConnected = true;
        await Log('backend', 'info', 'db', 'MongoDB reconnected');
      });

    } catch (error) {
      await Log('backend', 'fatal', 'db', `MongoDB connection failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect() {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      await Log('backend', 'info', 'db', 'MongoDB disconnected successfully');
    } catch (error) {
      await Log('backend', 'error', 'db', `MongoDB disconnection error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if database is connected
   */
  isConnected() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

// Create singleton instance
const database = new Database();

module.exports = database; 