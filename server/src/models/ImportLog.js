const mongoose = require('mongoose');

const importLogSchema = new mongoose.Schema(
  {
    sourceUrl: { type: String, required: true },
    totalFetched: { type: Number, default: 0 },
    totalImported: { type: Number, default: 0 },
    newJobs: { type: Number, default: 0 },
    updatedJobs: { type: Number, default: 0 },
    failedJobs: { type: Number, default: 0 },
    failedReasons: [String],
    startedAt: { type: Date, default: Date.now },
    finishedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ImportLog', importLogSchema);
