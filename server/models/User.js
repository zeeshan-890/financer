const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    university: String,
    batch: String,
    hostel: String,
    address: String,
    notes: String,
    addedAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        profileImage: String,
        currency: { type: String, default: 'INR' },
        monthlyBudget: { type: Number, default: 0 },
        income: { type: Number, default: 0 },
        friends: [FriendSchema],
        isVerified: { type: Boolean, default: false },
        verificationOTP: String,
        otpExpiry: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);