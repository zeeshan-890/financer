const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['payment_due', 'goal_deadline'], default: 'payment_due' },
        transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
        goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
        toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        amount: Number,
        dueDate: Date,
        sent: { type: Boolean, default: false },
        lastSentAt: Date,
        paymentReceived: { type: Boolean, default: false },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Reminder', ReminderSchema);