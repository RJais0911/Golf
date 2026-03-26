const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

async function connectDb() {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
  });
  console.log('MongoDB Atlas connected successfully');
}

module.exports = connectDb;
