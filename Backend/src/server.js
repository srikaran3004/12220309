const app = require('./app');
const config = require('./config');
const database = require('./database/connection');

const PORT = config.port;

(async () => {
  try {
    await database.connect();
    app.listen(PORT, () => {
      console.log(`Server running on http://${config.host}:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})(); 