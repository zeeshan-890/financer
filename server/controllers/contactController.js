const Contact = require('../models/Contact');

// Get all contacts
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ userId: req.user.id }).sort({ name: 1 });
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts' });
    }
};

// Add new contact
exports.addContact = async (req, res) => {
    try {
        const { name, email, phone, type, notes } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // Check if contact already exists
        const existingContact = await Contact.findOne({
            userId: req.user.id,
            email: email.toLowerCase()
        });

        if (existingContact) {
            return res.status(400).json({ message: 'Contact with this email already exists' });
        }

        const contact = new Contact({
            userId: req.user.id,
            name,
            email: email.toLowerCase(),
            phone,
            type: type || 'other',
            notes
        });

        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ message: 'Error adding contact' });
    }
};

// Update contact
exports.updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, type, notes } = req.body;

        const contact = await Contact.findOne({ _id: id, userId: req.user.id });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // If email is being changed, check for duplicates
        if (email && email.toLowerCase() !== contact.email) {
            const existingContact = await Contact.findOne({
                userId: req.user.id,
                email: email.toLowerCase(),
                _id: { $ne: id }
            });

            if (existingContact) {
                return res.status(400).json({ message: 'Contact with this email already exists' });
            }
        }

        if (name) contact.name = name;
        if (email) contact.email = email.toLowerCase();
        if (phone !== undefined) contact.phone = phone;
        if (type) contact.type = type;
        if (notes !== undefined) contact.notes = notes;

        await contact.save();
        res.json(contact);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Error updating contact' });
    }
};

// Delete contact
exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findOneAndDelete({
            _id: id,
            userId: req.user.id
        });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Error deleting contact' });
    }
};

// Get contact by ID
exports.getContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findOne({
            _id: id,
            userId: req.user.id
        });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ message: 'Error fetching contact' });
    }
};
