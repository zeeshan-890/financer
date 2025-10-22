const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES || '7d' });
};
