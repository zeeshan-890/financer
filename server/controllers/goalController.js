const asyncHandler = require('express-async-handler');
const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');


exports.createGoal = asyncHandler(async (req, res) => {
    const { title, targetAmount, deadline } = req.body;
    if (!title || !targetAmount) {
        res.status(400);
        throw new Error('Title and targetAmount required');
    }
    const goal = await Goal.create({ userId: req.user.id, title, targetAmount, deadline });
    res.status(201).json(goal);
});

exports.getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ userId: req.params.userId });
    res.json(goals);
});

exports.getAllGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
});

exports.updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    if (goal.userId.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    const { savedAmount, status } = req.body;

    if (savedAmount !== undefined) {
        goal.savedAmount = savedAmount;
    }

    if (status) {
        goal.status = status;
    }

    // Auto-complete if target reached
    if (goal.savedAmount >= goal.targetAmount) {
        goal.status = 'completed';
    }

    await goal.save();
    res.json(goal);
});

exports.addFunds = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }
    if (goal.userId.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    const { amount, note } = req.body;
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
        res.status(400);
        throw new Error('Invalid amount');
    }

    // Create an expense transaction (money moved into goal)
    await Transaction.create({
        title: `Added to goal: ${goal.title}`,
        amount: amt,
        type: 'expense',
        category: 'Goal Funding',
        date: new Date(),
        userId: req.user.id,
        notes: note || `Added to goal ${goal.title}`,
    });

    // Update goal saved amount and history
    goal.savedAmount = (goal.savedAmount || 0) + amt;
    goal.history = goal.history || [];
    goal.history.push({ amount: amt, date: new Date(), note: note || '' });

    if (goal.savedAmount >= goal.targetAmount) {
        goal.status = 'completed';
    }

    await goal.save();
    res.json(goal);
});

exports.deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }
    if (goal.userId.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted' });
});