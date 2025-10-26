const mongoose = require('mongoose');

const PaymentRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    friendName: {
        type: String,
        required: true
    },
    friendEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    dueDate: {
        type: Date
    },
    bankAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount'
    },
    bankAccountName: String,
    bankAccountNumber: String,
    reminderTiming: {
        type: String,
        enum: ['immediate', 'custom', 'manual'],
        default: 'immediate'
    },
    reminderInterval: {
        type: Number, // in hours
        default: 24
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending'
    },
    paidAt: Date,
    reminderSent: {
        type: Boolean,
        default: false
    },
    lastReminderSentAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('PaymentRequest', PaymentRequestSchema);
