require('dotenv').config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),

  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  queuePrefix: (process.env.QUEUE_PREFIX || 'job-importer').replace(/[:]/g, '-'),

  importWorkerConcurrency: Number(process.env.IMPORT_WORKER_CONCURRENCY || 5),
};

if (!config.mongoUri) {
  throw new Error('MONGO_URI is required');
}

module.exports = { config };
