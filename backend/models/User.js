const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    }
}, { timestamps: true });

// Passwordless authentication scheme

const User = mongoose.model('User', userSchema);

module.exports = User;
