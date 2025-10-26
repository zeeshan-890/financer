const Friend = require('../models/Friend');
const User = require('../models/User');

// Get all friends for user
exports.getAllFriends = async (req, res) => {
    try {
        const friends = await Friend.find({
            $or: [
                { userId: req.user.id },
                { friendId: req.user.id }
            ]
        })
            .populate('userId', 'name email profileImage')
            .populate('friendId', 'name email profileImage')
            .sort({ requestedAt: -1 });

        // Transform the data to show the friend's info
        const transformedFriends = friends.map(f => {
            const isSender = f.userId._id.toString() === req.user.id;
            const friend = isSender ? f.friendId : f.userId;

            return {
                _id: f._id,
                friend: {
                    _id: friend._id,
                    name: friend.name,
                    email: friend.email,
                    profileImage: friend.profileImage
                },
                status: f.status,
                isSentByMe: isSender,
                requestedAt: f.requestedAt,
                acceptedAt: f.acceptedAt
            };
        });

        res.json(transformedFriends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Error fetching friends' });
    }
};

// Send friend request
exports.sendFriendRequest = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find the user by email
        const friendUser = await User.findOne({ email });

        if (!friendUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (friendUser._id.toString() === req.user.id) {
            return res.status(400).json({ message: 'Cannot add yourself as friend' });
        }

        // Check if friendship already exists
        const existingFriend = await Friend.findOne({
            $or: [
                { userId: req.user.id, friendId: friendUser._id },
                { userId: friendUser._id, friendId: req.user.id }
            ]
        });

        if (existingFriend) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        const friend = new Friend({
            userId: req.user.id,
            friendId: friendUser._id,
            status: 'pending'
        });

        await friend.save();
        await friend.populate('friendId', 'name email profileImage');

        res.status(201).json({
            _id: friend._id,
            friend: {
                _id: friend.friendId._id,
                name: friend.friendId.name,
                email: friend.friendId.email,
                profileImage: friend.friendId.profileImage
            },
            status: friend.status,
            isSentByMe: true,
            requestedAt: friend.requestedAt
        });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Error sending friend request' });
    }
};

// Accept friend request
exports.acceptFriendRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const friend = await Friend.findOne({
            _id: id,
            friendId: req.user.id,
            status: 'pending'
        });

        if (!friend) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        friend.status = 'accepted';
        friend.acceptedAt = new Date();
        await friend.save();

        await friend.populate('userId', 'name email profileImage');

        res.json({
            _id: friend._id,
            friend: {
                _id: friend.userId._id,
                name: friend.userId.name,
                email: friend.userId.email,
                profileImage: friend.userId.profileImage
            },
            status: friend.status,
            isSentByMe: false,
            requestedAt: friend.requestedAt,
            acceptedAt: friend.acceptedAt
        });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ message: 'Error accepting friend request' });
    }
};

// Remove friend
exports.removeFriend = async (req, res) => {
    try {
        const { id } = req.params;

        const friend = await Friend.findOneAndDelete({
            _id: id,
            $or: [
                { userId: req.user.id },
                { friendId: req.user.id }
            ]
        });

        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        res.json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ message: 'Error removing friend' });
    }
};

// Search users by email
exports.searchUsers = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const users = await User.find({
            email: new RegExp(email, 'i'),
            _id: { $ne: req.user.id }
        })
            .select('name email profileImage')
            .limit(10);

        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Error searching users' });
    }
};

// Add friend manually (without request/accept flow)
exports.addFriendManually = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // Check if friendship already exists with this email
        const existingFriend = await Friend.findOne({
            userId: req.user.id,
            'friendId.email': email
        });

        if (existingFriend) {
            return res.status(400).json({ message: 'Friend with this email already exists' });
        }

        const friend = new Friend({
            userId: req.user.id,
            friendId: { name, email }, // Store as embedded document
            status: 'accepted', // Auto-accept for manual adds
            acceptedAt: new Date()
        });

        await friend.save();

        res.status(201).json({
            _id: friend._id,
            friend: {
                _id: friend.friendId._id || friend._id,
                name: friend.friendId.name || name,
                email: friend.friendId.email || email
            },
            status: friend.status,
            isSentByMe: true,
            requestedAt: friend.requestedAt,
            acceptedAt: friend.acceptedAt
        });
    } catch (error) {
        console.error('Error adding friend manually:', error);
        res.status(500).json({ message: 'Error adding friend' });
    }
};
