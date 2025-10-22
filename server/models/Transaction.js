const mongoose = require('mongoose');

const SplitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    amountOwed: Number,
    status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
    paidAt: Date,
});

const TransactionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        type: { type: String, enum: ['income', 'expense'], required: true },
        category: { type: String, required: true },
        date: { type: Date, default: Date.now },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
        splitBetween: [SplitSchema],
        notes: String,
        attachments: [String],
        isGroupExpense: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);