const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
});

const GroupSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        members: [MemberSchema],
        expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Group', GroupSchema);
