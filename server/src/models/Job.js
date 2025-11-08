const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true }, // unique job id from API
    title: String,
    link: String,
    company: String,
    description: String,
    category: String,
    location: String,
    pubDate: Date,
    rawData: Object, // store raw JSON in case of debugging
  },
  { timestamps: true }
);

jobSchema.index({ externalId: 1 }, { unique: true });

module.exports = mongoose.model('Job', jobSchema);
