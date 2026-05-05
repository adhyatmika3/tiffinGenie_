const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Main', 'Side', 'Fruit'], required: true },
    mealTime: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner'], default: 'Lunch' },
    category: { type: String },
    nutritionTags: [{ type: String }],
    prepTime: { type: Number },
    diet: { type: String, enum: ['veg', 'non-veg', 'vegan'], required: true },
    ingredients: [{ type: String }],
    allergens: [{ type: String }], // Explicit allergens
    addedBy: { type: String, default: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Meal', mealSchema);
