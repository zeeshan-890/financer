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

    const { name, currency, monthlyBudget, income } = req.body;

    if (name) user.name = name;
    if (currency) user.currency = currency;
    if (monthlyBudget !== undefined) user.monthlyBudget = monthlyBudget;
    if (income !== undefined) user.income = income;

    await user.save();

    res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        income: user.income,
    });
});

exports.addFriend = asyncHandler(async (req, res) => {
    const { email, name, phone, university, batch, hostel, address, notes, userId } = req.body;

    if (!email || !name) {
        res.status(400);
        throw new Error('Email and name are required');
    }

    const user = await User.findById(req.user.id);

    // Check if userId provided (existing user) or adding custom friend
    let friendData = {
        name,
        email,
        phone: phone || '',
        university: university || '',
        batch: batch || '',
        hostel: hostel || '',
        address: address || '',
        notes: notes || '',
    };

    if (userId) {
        // Adding existing user as friend
        const friend = await User.findById(userId);

        if (!friend) {
            res.status(404);
            throw new Error('User not found');
        }

        if (friend._id.toString() === req.user.id.toString()) {
            res.status(400);
            throw new Error('You cannot add yourself as a friend');
        }

        // Check if already friends
        const alreadyFriend = user.friends.find(f => f.userId && f.userId.toString() === friend._id.toString());
        if (alreadyFriend) {
            res.status(400);
            throw new Error('Already in your friends list');
        }

        friendData.userId = friend._id;
        // If adding existing user, use their profile data unless custom data provided
        if (!phone) friendData.phone = '';
        if (!university) friendData.university = '';
        if (!batch) friendData.batch = '';
        if (!hostel) friendData.hostel = '';
        if (!address) friendData.address = '';
    } else {
        // Adding custom friend (not a registered user)
        // Check if already exists by email
        const alreadyFriend = user.friends.find(f => f.email === email);
        if (alreadyFriend) {
            res.status(400);
            throw new Error('Friend with this email already exists');
        }
    }

    user.friends.push(friendData);
    await user.save();

    res.status(201).json(user.friends);
});

exports.removeFriend = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    user.friends = user.friends.filter(f => f.userId.toString() !== req.params.friendId);

    await user.save();

    res.json(user.friends);
});

exports.getFriends = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('friends');
    res.json(user.friends);
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