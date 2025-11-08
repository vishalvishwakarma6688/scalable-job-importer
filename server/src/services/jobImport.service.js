const axios = require('axios');
const xml2js = require('xml2js');
const Job = require('../models/Job');
const ImportLog = require('../models/ImportLog');
const { logger } = require('../utils/logger');

/**
 * Fetch XML, convert to JSON, import into MongoDB, and return stats.
 */
async function importJobsFromFeed(sourceUrl) {
    const log = await ImportLog.create({ sourceUrl });

    try {
        // 1. Fetch XML
        const { data: xml } = await axios.get(sourceUrl, { timeout: 15000 });

        const parser = new xml2js.Parser({
            explicitArray: false,
            strict: false, // ✅ allow malformed XML
            normalizeTags: true,
            normalize: true,
            trim: true,
        });
        const json = await parser.parseStringPromise(xml);


        const items = json.rss?.channel?.item || [];
        if (!Array.isArray(items)) return { message: 'No items found', count: 0 };

        log.totalFetched = items.length;

        let newJobs = 0;
        let updatedJobs = 0;
        let failedJobs = 0;
        const failedReasons = [];

        // 3. Process each job
        for (const item of items) {
            try {
                const externalId = item.guid?._ || item.guid || item.link;
                const updateData = {
                    title: item.title,
                    link: item.link,
                    company: item['job:company_name'] || item['company'] || 'Unknown',
                    description: item.description,
                    category: item['job:category'] || '',
                    location: item['job:location'] || '',
                    pubDate: item.pubDate ? new Date(item.pubDate) : undefined,
                    rawData: item,
                };

                const existing = await Job.findOneAndUpdate(
                    { externalId },
                    { $set: updateData },
                    { upsert: true, new: false } // new:false => return old doc if existed
                );

                if (existing) updatedJobs++;
                else newJobs++;
            } catch (err) {
                failedJobs++;
                failedReasons.push(err.message);
            }
        }

        // 4. Save log
        log.totalImported = newJobs + updatedJobs;
        log.newJobs = newJobs;
        log.updatedJobs = updatedJobs;
        log.failedJobs = failedJobs;
        log.failedReasons = failedReasons.slice(0, 10); // store limited
        log.finishedAt = new Date();
        await log.save();

        logger.info({
            sourceUrl,
            fetched: items.length,
            newJobs,
            updatedJobs,
            failedJobs,
        }, 'Feed imported successfully');

        return log;
    } catch (err) {
        log.failedJobs = log.totalFetched;
        log.failedReasons.push(err.message);
        log.finishedAt = new Date();
        await log.save();
        logger.error({ sourceUrl, err }, 'Feed import failed');
        throw err;
    }
}

module.exports = { importJobsFromFeed };
