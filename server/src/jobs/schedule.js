const cron = require('node-cron');
const { enqueueImport } = require('../queues/import.queue');
const { logger } = require('../utils/logger');

// 🧠 All source feeds from your assignment
const FEEDS = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://jobicy.com/?feed=job_feed&job_categories=business',
  'https://jobicy.com/?feed=job_feed&job_categories=management',
  'https://www.higheredjobs.com/rss/articleFeed.cfm'
];

// 🕐 Schedule every hour at minute 0
function startScheduler() {
  logger.info('⏰ Scheduler initialized. Will enqueue feeds every hour.');

  // run once on startup too (for dev)
  runAllFeeds();

  // Run hourly
  cron.schedule('0 * * * *', async () => {
    await runAllFeeds();
  });
}

// Helper: enqueue each feed
async function runAllFeeds() {
  logger.info('🚀 Enqueuing import jobs for all feeds...');
  for (const url of FEEDS) {
    try {
      await enqueueImport({ sourceUrl: url });
      logger.info(`Queued import for: ${url}`);
    } catch (err) {
      logger.error({ err, url }, 'Failed to enqueue feed');
    }
  }
}

module.exports = { startScheduler };
