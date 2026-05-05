const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Subscription = require('../models/Subscription');
const Feedback = require('../models/Feedback');

// @desc    Submit professional feedback/helpdesk ticket
// @route   POST /api/feedback
router.post('/feedback', async (req, res) => {
    try {
        const { parentName, parentEmail, topic, message } = req.body;
        if (!parentName || !parentEmail || !message) {
            return res.status(400).json({ message: 'Missing name, email, or message.' });
        }
        const feedback = await Feedback.create({ 
            parentName, 
            parentEmail, 
            topic: topic || 'General Help', 
            message 
        });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const { protect } = require('../middleware/authMiddleware');

// @desc    Get all feedback (Admin only)
// @route   GET /api/feedback
router.get('/feedback', protect, async (req, res) => {
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

// @desc    Store new contact message
// @route   POST /api/contact
router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required." });
        }

        const msg = await Contact.create({ name, email, subject, message });
        res.status(201).json({ status: "success", message: "Message received gracefully!", data: msg });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Store new subscription trigger
// @route   POST /api/subscribe
router.post('/subscribe', async (req, res) => {
    try {
        let { userId, plan } = req.body;
        if(!userId) userId = "guest_user_" + Date.now();
        if(!plan) plan = "free";

        const sub = await Subscription.create({ userId, plan });
        res.status(201).json({ status: "success", message: `Successfully registered for ${plan} plan!`, data: sub });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
