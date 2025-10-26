const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['hostel', 'class', 'neighbour', 'family', 'work', 'other'],
        default: 'other'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for faster queries
contactSchema.index({ userId: 1 });
contactSchema.index({ userId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Contact', contactSchema);
