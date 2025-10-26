const asyncHandler = require('express-async-handler');
const User = require('../models/User');

exports.getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user);
});

exports.updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const { name, currency, monthlyBudget, income, hideBalanceByDefault } = req.body;

    if (name) user.name = name;
    if (currency) user.currency = currency;
    if (monthlyBudget !== undefined) user.monthlyBudget = monthlyBudget;
    if (income !== undefined) user.income = income;
    if (hideBalanceByDefault !== undefined) user.hideBalanceByDefault = hideBalanceByDefault;

    await user.save();

    res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        income: user.income,
        hideBalanceByDefault: user.hideBalanceByDefault,
        hasBalancePin: !!user.balancePin
    });
});

// Set or update balance PIN
exports.setBalancePin = asyncHandler(async (req, res) => {
    const { pin, currentPin } = req.body;

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        res.status(400);
        throw new Error('PIN must be a 4-digit number');
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // If user already has a PIN, verify current PIN
    if (user.balancePin && currentPin) {
        const isValid = await user.verifyBalancePin(currentPin);
        if (!isValid) {
            res.status(401);
            throw new Error('Current PIN is incorrect');
        }
    }

    await user.setBalancePin(pin);
    await user.save();

    res.json({ message: 'PIN set successfully' });
});

// Verify balance PIN
exports.verifyBalancePin = asyncHandler(async (req, res) => {
    const { pin } = req.body;

    if (!pin) {
        res.status(400);
        throw new Error('PIN is required');
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (!user.balancePin) {
        res.status(400);
        throw new Error('No PIN set');
    }

    const isValid = await user.verifyBalancePin(pin);

    if (!isValid) {
        res.status(401);
        throw new Error('Invalid PIN');
    }

    res.json({ message: 'PIN verified successfully', valid: true });
});

// Remove balance PIN
exports.removeBalancePin = asyncHandler(async (req, res) => {
    const { currentPin } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (!user.balancePin) {
        res.status(400);
        throw new Error('No PIN set');
    }

    const isValid = await user.verifyBalancePin(currentPin);
    if (!isValid) {
        res.status(401);
        throw new Error('Current PIN is incorrect');
    }

    user.balancePin = undefined;
    await user.save();

    res.json({ message: 'PIN removed successfully' });
});

exports.searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.query;

    if (!query) {
        res.status(400);
        throw new Error('Search query required');
    }

    const users = await User.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
        ],
        _id: { $ne: req.user.id },
    })
        .select('name email')
        .limit(10);

    res.json(users);
});