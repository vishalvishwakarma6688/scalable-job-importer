const { Queue } = require('bullmq');
const { connection } = require('../config/redis');
const { config } = require('../config/env');
const IMPORT_QUEUE_NAME = `${config.queuePrefix}-job-import`;

const importQueue = new Queue(IMPORT_QUEUE_NAME, { connection });

async function enqueueImport(payload) {
  return importQueue.add('import-run', payload, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 1000,
    removeOnFail: 1000,
  });
}

module.exports = { importQueue, enqueueImport, IMPORT_QUEUE_NAME };
