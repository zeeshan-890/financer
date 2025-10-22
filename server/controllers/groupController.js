const asyncHandler = require('express-async-handler');
const Group = require('../models/Group');
const Transaction = require('../models/Transaction');

exports.createGroup = asyncHandler(async (req, res) => {
    const { name, members } = req.body;

    if (!name) {
        res.status(400);
        throw new Error('Group name required');
    }

    // Add creator to members if not already included
    const creatorInMembers = members?.find(m => m.userId?.toString() === req.user.id.toString());

    const groupMembers = members || [];
    if (!creatorInMembers) {
        groupMembers.push({
            userId: req.user.id,
            name: req.user.name,
            email: req.user.email,
        });
    }

    const group = await Group.create({
        name,
        createdBy: req.user.id,
        members: groupMembers,
    });

    res.status(201).json(group);
});

exports.getGroupDetails = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id)
        .populate('members.userId', 'name email')
        .populate({
            path: 'expenses',
            populate: { path: 'paidBy', select: 'name email' }
        });

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    res.json(group);
});

exports.getAllGroups = asyncHandler(async (req, res) => {
    const groups = await Group.find({
        'members.userId': req.user.id,
    }).populate('createdBy', 'name email');

    // Calculate totals for each group
    const groupsWithStats = await Promise.all(
        groups.map(async (group) => {
            const expenses = await Transaction.find({ groupId: group._id, type: 'expense' });

            const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

            // Calculate user's share
            let userShare = 0;
            expenses.forEach(exp => {
                const split = exp.splitBetween.find(s => s.userId.toString() === req.user.id.toString());
                if (split) {
                    userShare += split.amountOwed;
                }
            });

            return {
                ...group.toObject(),
                totalExpense,
                yourShare: userShare,
            };
        })
    );

    res.json(groupsWithStats);
});

exports.addMemberToGroup = asyncHandler(async (req, res) => {
    const { userId, name, email } = req.body;

    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    // Check if user is group creator or member
    const isMember = group.members.find(m => m.userId.toString() === req.user.id.toString());

    if (!isMember && group.createdBy.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    // Check if already a member
    const alreadyMember = group.members.find(m => m.userId.toString() === userId);

    if (alreadyMember) {
        res.status(400);
        throw new Error('User already in group');
    }

    group.members.push({ userId, name, email });
    await group.save();

    res.json(group);
});

exports.removeMemberFromGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    if (group.createdBy.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Only group creator can remove members');
    }

    group.members = group.members.filter(m => m.userId.toString() !== req.params.memberId);
    await group.save();

    res.json(group);
});