const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_tiffin_genie', {
        expiresIn: '30d',
    });
};

const ADMIN_EMAILS = [
    'owner@tiffingenie.com', 
    'admin@tiffingenie.com',
    'adhyatmika3@gmail.com'
];

// @desc    Register a new user
// @route   POST /api/auth/signup
const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const normalizedEmail = email.trim().toLowerCase();
        const assignedRole = ADMIN_EMAILS.includes(normalizedEmail) ? 'admin' : 'user';

        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
            // Update role if they are in the admin list
            if (ADMIN_EMAILS.includes(normalizedEmail)) user.role = 'admin';
            if (password) user.password = password; 
            await user.save();
        } else {
            user = await User.create({
                email: normalizedEmail,
                password: password,
                role: assignedRole
            });
        }

        res.status(201).json({
            _id: user.id,
            name: user.email.split('@')[0],
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
            message: 'Signup successful'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Handle Admin promotion
        if (ADMIN_EMAILS.includes(normalizedEmail)) {
            user.role = 'admin';
            await user.save();
        }

        // Handle Legacy Passwordless users
        if (!user.password) {
            user.password = password;
            await user.save();
        } else {
            if (!(await user.matchPassword(password))) {
                return res.status(401).json({ message: 'Incorrect password' });
            }
        }

        res.json({
            _id: user.id,
            name: user.email.split('@')[0],
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as an admin' });
        }
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getMe, getAllUsers };
