const Child = require('../models/Child');
const User = require('../models/User');

// @desc    Get all children for a user
// @route   GET /api/profile/children/:userId
// @access  Public (simplified)
const getChildren = async (req, res) => {
    try {
        const children = await Child.find({ userId: req.params.userId });
        res.json(children);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a child profile
// @route   POST /api/profile/child
// @access  Public (simplified)
const addChild = async (req, res) => {
    try {
        const { userId, name, age, gender, height, weight, diet, allergies, likes, dislikes } = req.body;
        
        if (!userId || !name) {
            return res.status(400).json({ message: 'User ID and Child Name are required' });
        }

        // Verify User exists
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newChild = await Child.create({
            userId,
            name,
            age,
            gender,
            height,
            weight,
            diet,
            allergies,
            likes,
            dislikes
        });
        
        res.status(201).json(newChild);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single child profile
// @route   GET /api/profile/child/:id
// @access  Public (simplified)
const getChild = async (req, res) => {
    try {
        const child = await Child.findById(req.params.id);

        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }
        res.json(child);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a child profile
// @route   PUT /api/profile/children/:childId
// @access  Public (simplified)
const updateChild = async (req, res) => {
    try {
        const child = await Child.findByIdAndUpdate(req.params.childId, req.body, { new: true });

        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }
        
        res.json(child);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a child profile
// @route   DELETE /api/profile/children/:childId
// @access  Public (simplified)
const removeChild = async (req, res) => {
    try {
        const child = await Child.findByIdAndDelete(req.params.childId);
        
        if(!child) {
             return res.status(404).json({ message: 'Child not found' });
        }
        res.json({ message: 'Child removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChildren,
    getChild,
    addChild,
    updateChild,
    removeChild
};
