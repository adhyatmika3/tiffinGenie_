const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_tiffin_genie', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide email' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        console.log(`[Signup Attempt] Checking if user exists: ${normalizedEmail}`);
        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            console.log(`[Signup] User already exists: ${normalizedEmail}, logging in directly.`);
            return res.status(200).json({
                _id: userExists.id,
                name: userExists.email.split('@')[0],
                email: userExists.email,
                token: generateToken(userExists.id),
                message: 'User already exists, logged in instead'
            });
        }

        const user = await User.create({
            email: normalizedEmail
        });

        if (user) {
            console.log(`[Signup Success] User saved to 'users' collection: ${normalizedEmail}`);
            res.status(201).json({
                _id: user.id,
                name: user.email.split('@')[0], // Fallback name
                email: user.email,
                token: generateToken(user.id),
                message: 'Signup successful'
            });
        } else {
            console.log(`[Signup Failed] Invalid user data for: ${normalizedEmail}`);
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide email' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        console.log(`[Login Attempt] Searching for user: ${normalizedEmail}`);

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            console.log(`[Login Failed] User not found: ${normalizedEmail}`);
            return res.status(401).json({ message: 'Invalid credentials - User not found' });
        }

        console.log(`[Login Success] Token generated for: ${normalizedEmail}`);
        res.json({
            _id: user.id,
            name: user.email.split('@')[0], // Fallback name
            email: user.email,
            token: generateToken(user.id),
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe
};
