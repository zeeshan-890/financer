const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        profileImage: String,
        currency: { type: String, default: 'PKR' },
        monthlyBudget: { type: Number, default: 0 },
        income: { type: Number, default: 0 },
        isVerified: { type: Boolean, default: false },
        verificationOTP: String,
        otpExpiry: Date,
        // Balance visibility PIN
        balancePin: { type: String },
        balanceVisible: { type: Boolean, default: true },
        // Settings
        hideBalanceByDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Method to hash and set PIN
UserSchema.methods.setBalancePin = async function (pin) {
    const salt = await bcrypt.genSalt(10);
    this.balancePin = await bcrypt.hash(pin, salt);
};

// Method to verify PIN
UserSchema.methods.verifyBalancePin = async function (pin) {
    if (!this.balancePin) return false;
    return await bcrypt.compare(pin, this.balancePin);
};

module.exports = mongoose.model('User', UserSchema);