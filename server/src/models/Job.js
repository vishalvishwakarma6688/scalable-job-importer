const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true }, 
    title: String,
    link: String,
    company: String,
    description: String,
    category: String,
    location: String,
    pubDate: Date,
    rawData: Object, 
  },
  { timestamps: true }
);

jobSchema.index({ externalId: 1 }, { unique: true });

module.exports = mongoose.model('Job', jobSchema);
