const express = require('express');
const router = express.Router();
const { generateMealPlan, generateWeeklyPlan, generateDayPlan } = require('../controllers/mealPlanController');
const { protect } = require('../middleware/authMiddleware');

router.get('/plan/:childId', protect, generateMealPlan);
router.post('/generate-plan', protect, generateWeeklyPlan);
router.post('/generate-day', protect, generateDayPlan);

module.exports = router;
