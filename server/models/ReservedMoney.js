const mongoose = require('mongoose');

const reservedMoneySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    recipientName: {
        type: String,
        required: true,
        trim: true
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['reserved', 'paid', 'cancelled'],
        default: 'reserved'
    },
    notes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paidAt: {
        type: Date
    }
});

module.exports = mongoose.model('ReservedMoney', reservedMoneySchema);
