const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all meals (CRUD)
// @route   GET /api/meals
// @access  Protected
router.get('/', protect, async (req, res) => {
    try {
        const meals = await Meal.find({});
        res.json(meals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add a meal
// @route   POST /api/meals
// @access  Protected
router.post('/', protect, async (req, res) => {
    try {
        const { name, type, diet, ingredients } = req.body;
        if (!name || !type || !diet) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        
        const safeIngredients = ingredients || [];
        
        const meal = await Meal.create({ name, type, diet, ingredients: safeIngredients });
        res.status(201).json(meal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a meal
// @route   DELETE /api/meals/:id
// @access  Protected
router.delete('/:id', protect, async (req, res) => {
    try {
        const meal = await Meal.findByIdAndDelete(req.params.id);
        if(!meal) {
            return res.status(404).json({ message: 'Meal not found' });
        }
        res.json({ message: 'Meal removed effectively' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
