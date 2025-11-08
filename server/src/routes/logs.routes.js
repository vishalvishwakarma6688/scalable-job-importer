const { Router } = require('express');
const ImportLog = require('../models/ImportLog');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ createdAt: -1 }).limit(20);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch import logs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const log = await ImportLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch log' });
  }
});

module.exports = router;
