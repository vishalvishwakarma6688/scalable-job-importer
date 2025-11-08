const { Router } = require('express');
const { enqueueImport } = require('../queues/import.queue');

const router = Router();

router.post('/run', async (req, res) => {
  try {
    const { sourceUrl } = req.body || {};
    if (!sourceUrl) {
      return res.status(400).json({ message: 'sourceUrl required' });
    }

    await enqueueImport({ sourceUrl });
    res.status(200).json({ message: 'Import job queued', sourceUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});


module.exports = router;
