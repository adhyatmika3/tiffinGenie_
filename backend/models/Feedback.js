const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    parentName: { type: String, required: true },
    parentEmail: { type: String, required: true },
    topic: { type: String, default: 'General' },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'In Progress', 'Resolved'], default: 'New' },
    adminResponse: { type: String, default: '' },
    isReadByParent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
