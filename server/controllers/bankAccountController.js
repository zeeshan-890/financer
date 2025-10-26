const BankAccount = require('../models/BankAccount');

// Get all bank accounts for user
exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await BankAccount.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(accounts);
    } catch (error) {
        console.error('Error fetching bank accounts:', error);
        res.status(500).json({ message: 'Error fetching bank accounts' });
    }
};

// Create new bank account
exports.createAccount = async (req, res) => {
    try {
        const { accountType, accountName, accountNumber, bankName, isDefault } = req.body;

        // Validation
        if (!accountType || !accountName || !accountNumber) {
            return res.status(400).json({ message: 'Account type, name, and number are required' });
        }

        if (accountType === 'bank' && !bankName) {
            return res.status(400).json({ message: 'Bank name is required for bank accounts' });
        }

        const account = new BankAccount({
            userId: req.user.id,
            accountType,
            accountName,
            accountNumber,
            bankName: accountType === 'bank' ? bankName : undefined,
            isDefault: isDefault || false
        });

        await account.save();
        res.status(201).json(account);
    } catch (error) {
        console.error('Error creating bank account:', error);
        res.status(500).json({ message: 'Error creating bank account' });
    }
};

// Update bank account
exports.updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountType, accountName, accountNumber, bankName, isDefault } = req.body;

        const account = await BankAccount.findOne({ _id: id, userId: req.user.id });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (accountType) account.accountType = accountType;
        if (accountName) account.accountName = accountName;
        if (accountNumber) account.accountNumber = accountNumber;
        if (bankName !== undefined) account.bankName = bankName;
        if (isDefault !== undefined) account.isDefault = isDefault;

        await account.save();
        res.json(account);
    } catch (error) {
        console.error('Error updating bank account:', error);
        res.status(500).json({ message: 'Error updating bank account' });
    }
};

// Delete bank account
exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;

        const account = await BankAccount.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting bank account:', error);
        res.status(500).json({ message: 'Error deleting bank account' });
    }
};

// Set default account
exports.setDefaultAccount = async (req, res) => {
    try {
        const { id } = req.params;

        const account = await BankAccount.findOne({ _id: id, userId: req.user.id });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        account.isDefault = true;
        await account.save();

        res.json(account);
    } catch (error) {
        console.error('Error setting default account:', error);
        res.status(500).json({ message: 'Error setting default account' });
    }
};
