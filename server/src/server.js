const { buildApp } = require('./app');
const { connectDB } = require('./config/db');
const { config } = require('./config/env');
const { logger } = require('./utils/logger');
const { startImportWorker, stopImportWorker } = require('./workers/import.worker');
const { startScheduler } = require('./jobs/schedule'); 

async function bootstrap() {
  await connectDB();

  startImportWorker();

  startScheduler();

  const app = buildApp();
  const server = app.listen(config.port, () => {
    logger.info(`API running on http://localhost:${config.port}`);
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received, shutting down...`);
    server.close(async () => {
      await stopImportWorker();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
