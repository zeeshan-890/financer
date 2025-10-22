const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const Transaction = require('../models/Transaction');
const emailService = require('./emailService');

// run every day at 9:00
function startCron() {
    const schedule = process.env.REMINDER_CRON || '0 9 * * *';
    cron.schedule(schedule, async () => {
        console.log('Running reminder cron job');

        const now = new Date();
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

        // Find active reminders that haven't been paid and either:
        // 1. Haven't been sent yet (sent: false), OR
        // 2. Were last sent more than 3 days ago
        const reminders = await Reminder.find({
            active: true,
            paymentReceived: false,
            $or: [
                { sent: false },
                { lastSentAt: { $lte: threeDaysAgo } }
            ]
        }).populate('toUser fromUser');

        let sentCount = 0;
        for (const r of reminders) {
            try {
                await emailService.sendReminderEmail(r);
                r.sent = true;
                r.lastSentAt = new Date();
                await r.save();
                sentCount++;
            } catch (err) {
                console.error('Failed to send reminder', err.message);
            }
        }

        console.log(`Sent ${sentCount} payment reminders`);
    });

    console.log('Cron job scheduled: Daily at 9:00 AM for payment reminders (resend every 3 days)');
}

module.exports = { startCron };