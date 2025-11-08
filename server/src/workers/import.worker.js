const { Worker, QueueEvents } = require('bullmq');
const { connection } = require('../config/redis');
const { config } = require('../config/env');
const { logger } = require('../utils/logger');
const { IMPORT_QUEUE_NAME } = require('../queues/import.queue');
const { importJobsFromFeed } = require('../services/jobImport.service');

let worker;
let events;

function startImportWorker() {
  worker = new Worker(
    IMPORT_QUEUE_NAME,
    async (job) => {
      const { sourceUrl } = job.data;
      logger.info({ sourceUrl }, 'Starting import for feed');
      const result = await importJobsFromFeed(sourceUrl);
      return { logId: result._id };
    },
    { connection, concurrency: config.importWorkerConcurrency }
  );

  events = new QueueEvents(IMPORT_QUEUE_NAME, { connection });

  worker.on('completed', (job) => {
    logger.info({ id: job.id, result: job.returnvalue }, 'Import job completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ id: job?.id, err }, 'Import job failed');
  });

  logger.info(`Worker started on queue "${IMPORT_QUEUE_NAME}" (concurrency=${config.importWorkerConcurrency})`);
}

function stopImportWorker() {
  return Promise.allSettled([worker?.close(), events?.close()]);
}

module.exports = { startImportWorker, stopImportWorker };
