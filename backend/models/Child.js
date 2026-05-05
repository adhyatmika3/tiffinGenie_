const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User' 
    },
    name: { 
        type: String, 
        required: true 
    },
    age: { 
        type: Number 
    },
    gender: { 
        type: String 
    },
    height: { 
        type: Number 
    },
    weight: { 
        type: Number 
    },
    diet: { 
        type: String,
        enum: ['veg', 'non-veg', 'Vegetarian', 'Non-Vegetarian'], 
        default: 'veg' 
    },
    allergies: [{ 
        type: String 
    }],
    likes: [{ 
        type: String 
    }],
    dislikes: [{ 
        type: String 
    }]
}, { timestamps: true });

const Child = mongoose.model('Child', childSchema);

module.exports = Child;
