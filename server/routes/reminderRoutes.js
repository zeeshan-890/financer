const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const auth = require('../middlewares/authMiddleware');

router.post('/send', auth, reminderController.sendReminderEmails);

module.exports = router;
