const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit feedback
// @route   POST /api/feedback
router.post('/', async (req, res) => {
    try {
        const { parentName, parentEmail, topic, message } = req.body;
        
        if (!parentName || !parentEmail || !message) {
            return res.status(400).json({ 
                message: 'Please provide your name, email, and message.',
                missing: { name: !parentName, email: !parentEmail, msg: !message }
            });
        }

        const feedback = await Feedback.create({ 
            parentName, 
            parentEmail, 
            topic: topic || 'General Inquiry', 
            message 
        });
        
        res.status(201).json(feedback);
    } catch (error) {
        console.error("[FEEDBACK API] Error:", error.message);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
});

// @desc    Get all feedback (Admin only)
// @route   GET /api/feedback
router.get('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
