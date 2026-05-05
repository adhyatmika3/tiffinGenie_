const express = require('express');
const router = express.Router();
const { getChildren, getChild, addChild, updateChild, removeChild } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Endpoints mounted at /api
router.post('/child', protect, addChild);
router.get('/child/:id', protect, getChild);
router.get('/children/:userId', protect, getChildren);
router.put('/child/:childId', protect, updateChild);
router.delete('/child/:childId', protect, removeChild);

module.exports = router;
