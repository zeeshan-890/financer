const mongoose = require('mongoose');

const requestLogSchema = new mongoose.Schema({
    method: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    statusCode: {
        type: Number,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String
    },
    browser: {
        type: String
    },
    os: {
        type: String
    },
    device: {
        type: String
    },
    referrer: {
        type: String
    },
    responseTime: {
        type: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    error: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
requestLogSchema.index({ timestamp: -1 });
requestLogSchema.index({ ip: 1 });
requestLogSchema.index({ url: 1 });

module.exports = mongoose.model('RequestLog', requestLogSchema);
