const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit a support ticket
// @route   POST /api/support/ticket
router.post('/ticket', async (req, res) => {
    try {
        const { parentName, parentEmail, topic, message } = req.body;
        if (!parentName || !parentEmail || !message) {
            return res.status(400).json({ message: 'Missing fields.' });
        }
        const ticket = await Feedback.create({ parentName, parentEmail, topic, message });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all tickets (Admin only)
// @route   GET /api/support/tickets
router.get('/tickets', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const tickets = await Feedback.find({}).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;





