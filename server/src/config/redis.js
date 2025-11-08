const IORedis = require('ioredis');
const { config } = require('./env');
const { logger } = require('../utils/logger');

const connection = new IORedis(config.redisUrl, {
  maxRetriesPerRequest: null, // recommended for BullMQ
});

connection.on('connect', () => logger.info('Redis connected'));
connection.on('error', (err) => logger.error({ err }, 'Redis error'));

module.exports = { connection };
