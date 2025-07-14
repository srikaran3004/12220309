const axios = require('axios');
const config = require('../config');

class Logger {
  constructor() {
    this.authToken = null;
    this.isAuthenticated = false;
  }

  async authenticate() {
    try {
      const response = await axios.post(config.testServer.authUrl, {
        email: config.auth.email,
        name: config.auth.name,
        rollNo: config.auth.rollNo,
        accessCode: config.auth.accessCode,
      });
      if (response.data.access_token) {
        this.authToken = response.data.access_token;
        this.isAuthenticated = true;
        console.log('Successfully authenticated with test server');
      }
    } catch (error) {
      console.error('Failed to authenticate with test server:', error);
      throw new Error('Authentication failed');
    }
  }

  async sendLog(logRequest) {
    if (!this.isAuthenticated || !this.authToken) {
      try {
        await this.authenticate();
      } catch (error) {
        console.error('Failed to authenticate for logging:', error);
        return;
      }
    }
    try {
      const response = await axios.post(
        config.testServer.logsUrl,
        logRequest,
        {
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        console.log(`Log sent successfully: ${response.data.logID}`);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        this.isAuthenticated = false;
        this.authToken = null;
        try {
          await this.authenticate();
          await this.sendLog(logRequest);
        } catch (authError) {
          console.error('Failed to re-authenticate:', authError);
        }
      } else {
        console.error('Failed to send log to test server:', error);
      }
    }
  }

  async Log(stack, level, pkg, message) {
    const logRequest = {
      stack,
      level,
      package: pkg,
      message,
    };
    await this.sendLog(logRequest);
  }
}

const logger = new Logger();

const Log = async (stack, level, pkg, message) => {
  await logger.Log(stack, level, pkg, message);
};

module.exports = { Log, logger }; 