const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

async function connectDb() {
  const fallbackUri = 'mongodb://127.0.0.1:27017/golf_charity_db';

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB connected: ${MONGODB_URI}`);
  } catch (error) {
    const shouldFallbackToLocal =
      process.env.NODE_ENV === 'development' &&
      MONGODB_URI.startsWith('mongodb+srv://') &&
      !MONGODB_URI.includes('127.0.0.1') &&
      !MONGODB_URI.includes('localhost');

    if (!shouldFallbackToLocal) {
      throw error;
    }

    console.warn(
      `Primary MongoDB connection failed (${error.code || error.message}). Retrying with local development MongoDB...`
    );

    await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB connected: ${fallbackUri}`);
  }
}

module.exports = connectDb;
