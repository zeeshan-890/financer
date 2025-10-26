const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const Group = require('../models/Group');
const User = require('../models/User');
const Reminder = require('../models/Reminder');
const ReservedMoney = require('../models/ReservedMoney');
const BankAccount = require('../models/BankAccount');
const { sendExpenseNotification } = require('../services/emailService');

exports.addTransaction = asyncHandler(async (req, res) => {
    const { title, amount, type, category, date, groupId, splitBetween, notes, isGroupExpense, bankAccountId } = req.body;

    if (!title || !amount || !type || !category) {
        res.status(400);
        throw new Error('Title, amount, type, and category are required');
    }

    const txData = {
        title,
        amount,
        type,
        category,
        date: date || new Date(),
        userId: req.user.id,
        notes,
        isGroupExpense: isGroupExpense || false,
    };

    if (isGroupExpense && splitBetween && splitBetween.length > 0) {
        // Add paidBy and splitBetween for all group expenses
        txData.paidBy = req.user.id;
        txData.splitBetween = splitBetween;

        // Add groupId if provided
        if (groupId) {
            txData.groupId = groupId;
        }

        // Create transaction (this is the expense record)
        const tx = await Transaction.create(txData);
        console.log(`Created group expense transaction: ${amount} for ${title}`);

        // Create reminders and send immediate email notifications
        for (const split of splitBetween) {
            console.log('Processing split:', { email: split.email, name: split.name, userId: split.userId, status: split.status });

            if (split.status === 'pending') {
                // Create reminder in database (only if userId exists)
                if (split.userId && split.userId.toString() !== req.user.id.toString()) {
                    await Reminder.create({
                        type: 'payment_due',
                        transactionId: tx._id,
                        toUser: split.userId,
                        fromUser: req.user.id,
                        amount: split.amountOwed,
                        message: `You owe ₹${split.amountOwed} to ${req.user.name} for ${title}`,
                        active: true,
                    });
                }

                // Send immediate email notification (always send if there's an email)
                if (split.email && split.email !== req.user.email) {
                    try {
                        console.log(`📧 Attempting to send email to ${split.email}...`);
                        await sendExpenseNotification(
                            split.email,
                            split.name,
                            req.user.name,
                            title,
                            amount,
                            split.amountOwed
                        );
                        console.log(`✅ Expense notification sent to ${split.email}`);
                    } catch (emailError) {
                        console.error(`❌ Failed to send email to ${split.email}:`, emailError.message);
                        console.error('Full error:', emailError);
                        // Don't fail the transaction if email fails
                    }
                }
            }
        }

        // Update group expenses if groupId is provided
        if (groupId) {
            const group = await Group.findById(groupId);
            if (group) {
                group.expenses.push(tx._id);
                await group.save();
            }
        }

        res.status(201).json(tx);
    } else {
        const tx = await Transaction.create(txData);
        res.status(201).json(tx);
    }
});

exports.updatePaymentStatus = asyncHandler(async (req, res) => {
    const tx = await Transaction.findById(req.params.id).populate('paidBy', 'name email');
    if (!tx) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    const { userId, status } = req.body;
    const split = tx.splitBetween.find(s => s.userId?.toString() === userId || s._id?.toString() === userId);

    if (!split) {
        res.status(400);
        throw new Error('Split not found for user');
    }

    const previousStatus = split.status;
    split.status = status;

    if (status === 'paid' && previousStatus === 'pending') {
        split.paidAt = new Date();

        // Create an income transaction for the user who paid upfront
        const incomeTransaction = await Transaction.create({
            title: `Payment received from ${split.name} for ${tx.title}`,
            amount: split.amountOwed,
            type: 'income',
            category: 'Payment Received',
            date: new Date(),
            userId: tx.paidBy || tx.userId,
            notes: `Friend payment received for group expense`,
            isGroupExpense: false,
        });

        console.log(`Created income transaction: ${split.amountOwed} from ${split.name}`);

        // Mark reminder as payment received and deactivate
        await Reminder.updateMany(
            { transactionId: tx._id, toUser: userId, active: true },
            { $set: { paymentReceived: true, active: false } }
        );
    }

    await tx.save();
    res.json(tx);
});

exports.getAllTransactions = asyncHandler(async (req, res) => {
    const { type, category, startDate, endDate } = req.query;

    const filter = { userId: req.user.id };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
        .populate('groupId', 'name')
        .populate('splitBetween.userId', 'name email')
        .sort({ date: -1 });

    res.json(transactions);
});

exports.getTransactionStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Get all user transactions
    const transactions = await Transaction.find({ userId });

    // Get reserved money total
    const reservedResult = await ReservedMoney.aggregate([
        { $match: { userId: userId, status: 'reserved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const reservedAmount = reservedResult.length > 0 ? reservedResult[0].total : 0;

    // Calculate totals
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;
    const usableBalance = balance - reservedAmount;

    // Category breakdown
    const categoryData = {};
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            if (!categoryData[t.category]) {
                categoryData[t.category] = 0;
            }
            categoryData[t.category] += t.amount;
        });

    // Monthly trends (last 6 months)
    const monthlyData = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const monthIncome = transactions
            .filter(t => t.type === 'income' && t.date >= monthDate && t.date <= monthEnd)
            .reduce((sum, t) => sum + t.amount, 0);

        const monthExpenses = transactions
            .filter(t => t.type === 'expense' && t.date >= monthDate && t.date <= monthEnd)
            .reduce((sum, t) => sum + t.amount, 0);

        monthlyData.push({
            month: monthDate.toLocaleString('default', { month: 'short' }),
            income: monthIncome,
            expense: monthExpenses,
        });
    }

    // Daily expense heatmap data (last 90 days)
    const heatmapData = [];
    for (let i = 89; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStart = new Date(date.setHours(0, 0, 0, 0));
        const dateEnd = new Date(date.setHours(23, 59, 59, 999));

        const dayExpenses = transactions
            .filter(t => t.type === 'expense' && t.date >= dateStart && t.date <= dateEnd)
            .reduce((sum, t) => sum + t.amount, 0);

        heatmapData.push({
            date: dateStart.toISOString().split('T')[0],
            amount: dayExpenses,
        });
    }

    res.json({
        income,
        expenses,
        balance,
        reservedAmount,
        usableBalance,
        categoryData,
        monthlyData,
        heatmapData,
    });
});

exports.deleteTransaction = asyncHandler(async (req, res) => {
    const tx = await Transaction.findById(req.params.id);

    if (!tx) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    if (tx.userId.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    // Deactivate related reminders
    await Reminder.updateMany(
        { transactionId: tx._id },
        { $set: { active: false } }
    );

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
});