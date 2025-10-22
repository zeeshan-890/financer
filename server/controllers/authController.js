const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail } = require('../services/emailService');

// Helper to generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please provide name, email and password');
    }

    const existing = await User.findOne({ email });
    if (existing) {
        res.status(400);
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
        name,
        email,
        passwordHash,
        verificationOTP: otp,
        otpExpiry,
        isVerified: false
    });

    // Send OTP email
    try {
        await sendOTPEmail(email, otp, name);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }

    const { generateToken } = require('../utils/token');
    const token = generateToken({ id: user._id });

    res.status(201).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified
        },
        token,
        message: 'Account created! Please verify your email with the OTP sent to your inbox.'
    });
});

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // If not verified, resend OTP
    if (!user.isVerified) {
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.verificationOTP = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        try {
            await sendOTPEmail(email, otp, user.name);
        } catch (error) {
            console.error('Error sending OTP email:', error);
        }
    }

    const { generateToken } = require('../utils/token');
    const token = generateToken({ id: user._id });
    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified
        },
        token,
        message: user.isVerified ? 'Login successful' : 'Please verify your email with the OTP sent to your inbox.'
    });
});

exports.verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400);
        throw new Error('Please provide email and OTP');
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.isVerified) {
        res.status(400);
        throw new Error('Email already verified');
    }

    if (!user.verificationOTP || !user.otpExpiry) {
        res.status(400);
        throw new Error('No OTP found. Please request a new one.');
    }

    if (new Date() > user.otpExpiry) {
        res.status(400);
        throw new Error('OTP has expired. Please request a new one.');
    }

    if (user.verificationOTP !== otp) {
        res.status(400);
        throw new Error('Invalid OTP');
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({
        message: 'Email verified successfully!',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified
        }
    });
});

exports.resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Please provide email');
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.isVerified) {
        res.status(400);
        throw new Error('Email already verified');
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationOTP = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    try {
        await sendOTPEmail(email, otp, user.name);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500);
        throw new Error('Failed to send OTP email');
    }

    res.json({ message: 'OTP sent to your email' });
});
