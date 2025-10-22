const asyncHandler = require('express-async-handler');
const Reminder = require('../models/Reminder');
const emailService = require('../services/emailService');

exports.sendReminderEmails = asyncHandler(async (req, res) => {
    const { reminderId } = req.body;
    let reminders;
    if (reminderId) {
        const r = await Reminder.findById(reminderId);
        if (!r) {
            res.status(404);
            throw new Error('Reminder not found');
        }
        reminders = [r];
    } else {
        reminders = await Reminder.find({ sent: false }).populate('toUser fromUser transactionId');
    }

    for (const r of reminders) {
        await emailService.sendReminderEmail(r);
        r.sent = true;
        r.lastSentAt = new Date();
        await r.save();
    }

    res.json({ sent: reminders.length });
});
