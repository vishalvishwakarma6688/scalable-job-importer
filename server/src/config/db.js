const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const { config } = require('./env');

async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoUri);
  logger.info('MongoDB connected');
}

module.exports = { connectDB };
