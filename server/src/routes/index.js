const { Router } = require('express');
const health = require('./health.routes');
const importRoutes = require('./import.routes');
const logsRoutes = require('./logs.routes'); // ✅ new

const router = Router();

router.use('/health', health);
router.use('/import', importRoutes);
router.use('/logs', logsRoutes); // ✅ new

module.exports = router;
