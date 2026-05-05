const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Main', 'Side', 'Fruit'], required: true }, // Main, Side, Fruit
    category: { type: String }, // e.g., 'Sandwich', 'Pizza', 'Roll'
    nutritionTags: [{ type: String }], // e.g., 'protein', 'carbs', 'fiber', 'vitamins'
    prepTime: { type: Number }, // in minutes
    diet: { type: String, enum: ['veg', 'non-veg'], required: true },
    ingredients: [{ type: String }],
    allergens: [{ type: String }], // Explicit allergens
    addedBy: { type: String, default: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Meal', mealSchema);
