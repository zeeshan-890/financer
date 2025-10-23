const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get all logs with filters
router.get('/logs', adminController.getAllLogs);

// Get dashboard statistics
router.get('/stats', adminController.getStats);

// Cleanup old logs
router.post('/cleanup', adminController.cleanupLogs);

module.exports = router;
