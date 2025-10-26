const PaymentRequest = require('../models/PaymentRequest');
const BankAccount = require('../models/BankAccount');
const Contact = require('../models/Contact');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const emailService = require('../services/emailService');

// Get all payment requests
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await PaymentRequest.find({
            userId: req.user.id,
            status: { $ne: 'cancelled' }
        })
            .populate('friendId', 'name email')
            .populate('bankAccountId', 'accountName accountNumber bankName accountType')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error('Error fetching payment requests:', error);
        res.status(500).json({ message: 'Error fetching payment requests' });
    }
};

// Create payment request
exports.createRequest = async (req, res) => {
    try {
        const {
            friendId,
            friendName,
            friendEmail,
            amount,
            reason,
            dueDate,
            bankAccountId,
            reminderTiming,
            message
        } = req.body;

        if (!friendId || !amount || !reason || !message) {
            return res.status(400).json({ message: 'Friend, amount, reason, and message are required' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }

        // Verify contact exists
        const contact = await Contact.findById(friendId);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        const requestData = {
            userId: req.user.id,
            friendId,
            friendName: friendName || contact.name,
            friendEmail: friendEmail || contact.email,
            amount,
            reason,
            dueDate: dueDate || undefined,
            reminderTiming: reminderTiming || 'immediate',
            message,
            status: 'pending'
        };

        // Store bank account reference if provided (for display purposes only)
        let bankAccount = null;
        if (bankAccountId) {
            bankAccount = await BankAccount.findById(bankAccountId);
            if (bankAccount && bankAccount.userId.toString() === req.user.id) {
                requestData.bankAccountId = bankAccountId;
                requestData.bankAccountName = bankAccount.accountName;
                requestData.bankAccountNumber = bankAccount.accountNumber;
            }
        }

        const paymentRequest = new PaymentRequest(requestData);
        await paymentRequest.save();

        // Create an EXPENSE transaction (money you lent/gave to friend)
        await Transaction.create({
            title: `Payment Request: ${reason}`,
            amount,
            type: 'expense',
            category: 'Payment Request',
            date: new Date(),
            userId: req.user.id,
            notes: `Payment requested from ${friendName || contact.name}`,
        });

        console.log(`Created payment request expense transaction: ${amount} for ${reason}`);

        // Send immediate reminder if selected
        if (reminderTiming === 'immediate') {
            try {
                await emailService.sendPaymentRequestEmail({
                    toEmail: requestData.friendEmail,
                    toName: requestData.friendName,
                    fromName: req.user.name,
                    amount: requestData.amount,
                    reason: requestData.reason,
                    message: requestData.message,
                    dueDate: requestData.dueDate,
                    bankAccount: bankAccount ? {
                        name: bankAccount.accountName,
                        number: bankAccount.accountNumber,
                        bank: bankAccount.bankName,
                        type: bankAccount.accountType
                    } : null
                });

                paymentRequest.reminderSent = true;
                paymentRequest.lastReminderSentAt = new Date();
                await paymentRequest.save();
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                // Don't fail the request creation if email fails
            }
        }

        await paymentRequest.populate('friendId', 'name email');
        if (bankAccountId) {
            await paymentRequest.populate('bankAccountId', 'accountName accountNumber bankName accountType');
        }

        res.status(201).json(paymentRequest);
    } catch (error) {
        console.error('Error creating payment request:', error);
        res.status(500).json({ message: 'Error creating payment request' });
    }
};

// Update payment request
exports.updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paidAt } = req.body;

        const request = await PaymentRequest.findOne({
            _id: id,
            userId: req.user.id
        });

        if (!request) {
            return res.status(404).json({ message: 'Payment request not found' });
        }

        if (status) {
            const previousStatus = request.status;
            request.status = status;

            // If changing from pending to paid, create an INCOME transaction
            if (status === 'paid' && previousStatus === 'pending' && !request.paidAt) {
                await Transaction.create({
                    title: `Payment Received: ${request.reason}`,
                    amount: request.amount,
                    type: 'income',
                    category: 'Payment Request',
                    date: new Date(),
                    userId: req.user.id,
                    notes: `Payment received from ${request.friendName}`,
                });

                console.log(`Created payment received income transaction: ${request.amount} from ${request.friendName}`);
                request.paidAt = paidAt || new Date();
            }
        }

        await request.save();
        res.json(request);
    } catch (error) {
        console.error('Error updating payment request:', error);
        res.status(500).json({ message: 'Error updating payment request' });
    }
};

// Mark as paid
exports.markAsPaid = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await PaymentRequest.findOne({
            _id: id,
            userId: req.user.id
        });

        if (!request) {
            return res.status(404).json({ message: 'Payment request not found' });
        }

        // Create an INCOME transaction (friend paid you back)
        await Transaction.create({
            title: `Payment Received: ${request.reason}`,
            amount: request.amount,
            type: 'income',
            category: 'Payment Request',
            date: new Date(),
            userId: req.user.id,
            notes: `Payment received from ${request.friendName}`,
        });

        console.log(`Created payment received income transaction: ${request.amount} from ${request.friendName}`);

        request.status = 'paid';
        request.paidAt = new Date();
        await request.save();

        res.json(request);
    } catch (error) {
        console.error('Error marking as paid:', error);
        res.status(500).json({ message: 'Error marking as paid' });
    }
};

// Send reminder manually
exports.sendReminder = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await PaymentRequest.findOne({
            _id: id,
            userId: req.user.id,
            status: 'pending'
        }).populate('bankAccountId', 'accountName accountNumber bankName accountType');

        if (!request) {
            return res.status(404).json({ message: 'Payment request not found or already paid' });
        }

        const user = await User.findById(req.user.id);

        await emailService.sendPaymentRequestEmail({
            toEmail: request.friendEmail,
            toName: request.friendName,
            fromName: user.name,
            amount: request.amount,
            reason: request.reason,
            message: request.message,
            dueDate: request.dueDate,
            bankAccount: request.bankAccountId ? {
                name: request.bankAccountId.accountName,
                number: request.bankAccountId.accountNumber,
                bank: request.bankAccountId.bankName,
                type: request.bankAccountId.accountType
            } : null
        });

        request.reminderSent = true;
        request.lastReminderSentAt = new Date();
        await request.save();

        res.json({ message: 'Reminder sent successfully', request });
    } catch (error) {
        console.error('Error sending reminder:', error);
        res.status(500).json({ message: 'Error sending reminder' });
    }
};

// Delete payment request
exports.deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await PaymentRequest.findOneAndDelete({
            _id: id,
            userId: req.user.id
        });

        if (!request) {
            return res.status(404).json({ message: 'Payment request not found' });
        }

        res.json({ message: 'Payment request deleted' });
    } catch (error) {
        console.error('Error deleting payment request:', error);
        res.status(500).json({ message: 'Error deleting payment request' });
    }
};
