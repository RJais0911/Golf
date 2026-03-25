require('./src/config/env');
const app = require('./src/app');
const connectDb = require('./src/config/db');
const { PORT } = require('./src/config/env');

async function startServer() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();
