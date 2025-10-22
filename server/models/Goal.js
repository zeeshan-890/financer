const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        targetAmount: { type: Number, required: true },
        savedAmount: { type: Number, default: 0 },
        history: [
            {
                amount: Number,
                date: Date,
                note: String,
            },
        ],
        deadline: Date,
        status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Goal', GoalSchema);
