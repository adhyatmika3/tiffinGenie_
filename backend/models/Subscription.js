const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    plan: { type: String, enum: ['free', 'premium', 'family'], required: true },
    status: { type: String, enum: ['active', 'expired', 'trialing'], default: 'trialing' },
    startDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
