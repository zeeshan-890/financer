const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    let token = req.headers.authorization || req.headers.Authorization;
    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }
    if (!token) {
        res.status(401);
        return next(new Error('Not authorized, no token'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id).select('-passwordHash');
        if (!user) {
            res.status(401);
            return next(new Error('Not authorized'));
        }
        req.user = { id: user._id, name: user.name, email: user.email };
        next();
    } catch (err) {
        res.status(401);
        next(new Error('Token invalid'));
    }
};

// Export both as default and named export for compatibility
module.exports = authMiddleware;
module.exports.protect = authMiddleware;
