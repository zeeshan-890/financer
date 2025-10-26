const ReservedMoney = require('../models/ReservedMoney');
const User = require('../models/User');

// Get all reserved money entries
exports.getAllReserved = async (req, res) => {
    try {
        const reserved = await ReservedMoney.find({
            userId: req.user.id,
            status: { $ne: 'cancelled' }
        })
            .populate('friendId', 'name email')
            .sort({ createdAt: -1 });

        const totalReserved = reserved
            .filter(r => r.status === 'reserved')
            .reduce((sum, r) => sum + r.amount, 0);

        res.json({
            reserved,
            totalReserved
        });
    } catch (error) {
        console.error('Error fetching reserved money:', error);
        res.status(500).json({ message: 'Error fetching reserved money' });
    }
};

// Create reserved money entry
exports.createReserved = async (req, res) => {
    try {
        const { reservationType, friendId, amount, reason, recipientName, recipientEmail, dueDate, notes } = req.body;

        if (!amount || !reason) {
            return res.status(400).json({ message: 'Amount and reason are required' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }

        const reservedData = {
            userId: req.user.id,
            reservationType: reservationType || 'custom',
            amount,
            reason,
            recipientName,
            dueDate,
            notes,
            status: 'reserved'
        };

        // If it's a friend reservation, validate and add friend info
        if (reservationType === 'friend') {
            if (!friendId) {
                return res.status(400).json({ message: 'Friend ID is required for friend reservations' });
            }

            const friend = await User.findById(friendId);
            if (!friend) {
                return res.status(404).json({ message: 'Friend not found' });
            }

            reservedData.friendId = friendId;
            reservedData.recipientName = friend.name;
            reservedData.recipientEmail = friend.email;
        } else {
            // For custom reservations, recipient name is required
            if (!recipientName) {
                return res.status(400).json({ message: 'Item/thing name is required for custom reservations' });
            }
            if (recipientEmail) {
                reservedData.recipientEmail = recipientEmail;
            }
        }

        const reserved = new ReservedMoney(reservedData);
        await reserved.save();

        // Populate friend info if it's a friend reservation
        if (reservationType === 'friend') {
            await reserved.populate('friendId', 'name email');
        }

        res.status(201).json(reserved);
    } catch (error) {
        console.error('Error creating reserved money:', error);
        res.status(500).json({ message: 'Error creating reserved money' });
    }
};

// Update reserved money entry
exports.updateReserved = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, reason, recipientName, dueDate, notes, status } = req.body;

        const reserved = await ReservedMoney.findOne({ _id: id, userId: req.user.id });

        if (!reserved) {
            return res.status(404).json({ message: 'Reserved money entry not found' });
        }

        if (amount !== undefined) reserved.amount = amount;
        if (reason) reserved.reason = reason;
        if (recipientName) reserved.recipientName = recipientName;
        if (dueDate !== undefined) reserved.dueDate = dueDate;
        if (notes !== undefined) reserved.notes = notes;
        if (status) {
            reserved.status = status;
            if (status === 'paid') {
                reserved.paidAt = new Date();
            }
        }

        await reserved.save();
        res.json(reserved);
    } catch (error) {
        console.error('Error updating reserved money:', error);
        res.status(500).json({ message: 'Error updating reserved money' });
    }
};

// Mark as paid
exports.markAsPaid = async (req, res) => {
    try {
        const { id } = req.params;

        const reserved = await ReservedMoney.findOne({ _id: id, userId: req.user.id });

        if (!reserved) {
            return res.status(404).json({ message: 'Reserved money entry not found' });
        }

        reserved.status = 'paid';
        reserved.paidAt = new Date();
        await reserved.save();

        res.json(reserved);
    } catch (error) {
        console.error('Error marking as paid:', error);
        res.status(500).json({ message: 'Error marking as paid' });
    }
};

// Delete reserved money entry
exports.deleteReserved = async (req, res) => {
    try {
        const { id } = req.params;

        const reserved = await ReservedMoney.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!reserved) {
            return res.status(404).json({ message: 'Reserved money entry not found' });
        }

        res.json({ message: 'Reserved money entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting reserved money:', error);
        res.status(500).json({ message: 'Error deleting reserved money' });
    }
};

// Get total reserved amount
exports.getTotalReserved = async (req, res) => {
    try {
        const reserved = await ReservedMoney.find({
            userId: req.user.id,
            status: 'reserved'
        });

        const total = reserved.reduce((sum, r) => sum + r.amount, 0);

        res.json({ totalReserved: total });
    } catch (error) {
        console.error('Error calculating total reserved:', error);
        res.status(500).json({ message: 'Error calculating total reserved' });
    }
};
