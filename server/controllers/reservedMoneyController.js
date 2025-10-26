const ReservedMoney = require('../models/ReservedMoney');

// Get all reserved money entries
exports.getAllReserved = async (req, res) => {
    try {
        const reserved = await ReservedMoney.find({
            userId: req.user.id,
            status: { $ne: 'cancelled' }
        }).sort({ createdAt: -1 });

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
        const { amount, reason, recipientName, dueDate, notes } = req.body;

        if (!amount || !reason || !recipientName) {
            return res.status(400).json({ message: 'Amount, reason, and recipient name are required' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }

        const reserved = new ReservedMoney({
            userId: req.user.id,
            amount,
            reason,
            recipientName,
            dueDate,
            notes,
            status: 'reserved'
        });

        await reserved.save();
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
