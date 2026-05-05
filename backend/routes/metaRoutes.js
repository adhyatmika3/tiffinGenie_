const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Subscription = require('../models/Subscription');

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
