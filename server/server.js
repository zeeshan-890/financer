require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');

const app = express();

// Connect to DB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Request logger middleware (logs all requests)
app.use(requestLogger);

// API Routes
const validateRequest = require('./middlewares/validateRequest');
const { registerSchema, loginSchema } = require('./utils/validators');
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/bank-accounts', require('./routes/bankAccountRoutes'));
app.use('/api/friends', require('./routes/friendRoutes'));
app.use('/api/reserved-money', require('./routes/reservedMoneyRoutes'));
app.use('/api/payment-requests', require('./routes/paymentRequestRoutes'));

// Serve static files from Next.js build
app.use(express.static(path.join(__dirname, 'public')));

// Serve Next.js app for all non-API routes
app.get('*', (req, res) => {
    // Try to serve the specific HTML file first
    const requestedPath = req.path === '/' ? '/index.html' : req.path;
    const filePath = path.join(__dirname, 'public', requestedPath);

    // Check if a .html file exists for this path
    const htmlPath = requestedPath.endsWith('.html') ? filePath : filePath + '.html';

    // Check common Next.js export patterns
    const possiblePaths = [
        filePath,
        htmlPath,
        path.join(__dirname, 'public', requestedPath, 'index.html'),
        path.join(__dirname, 'public', requestedPath.replace(/\/$/, ''), 'index.html'),
        path.join(__dirname, 'public', 'index.html') // fallback
    ];

    const fs = require('fs');
    for (const p of possiblePaths) {
        if (fs.existsSync(p) && fs.statSync(p).isFile()) {
            return res.sendFile(p);
        }
    }

    // Default fallback to root index.html for SPA routing
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Start cron jobs
const cronService = require('./services/cronService');
cronService.startCron();
