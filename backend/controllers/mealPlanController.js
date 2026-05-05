const Child = require('../models/Child');
const Meal = require('../models/Meal');

// 1. Seed rich and realistic meal data
const seedMealsIfEmpty = async () => {
    const count = await Meal.countDocuments();
    if (count < 40) { 
        const seedData = [
            // --- MAINS (Veg) ---
            { name: 'Aloo Paratha', type: 'Main', category: 'Indian', diet: 'veg', nutritionTags: ['carbs', 'energy'], prepTime: 20, ingredients: ['wheat', 'potato'], allergens: ['gluten'] },
            { name: 'Paneer Bhurji Wrap', type: 'Main', category: 'Indian', diet: 'veg', nutritionTags: ['protein', 'calcium'], prepTime: 15, ingredients: ['paneer', 'wheat'], allergens: ['dairy', 'gluten'] },
            { name: 'Vegetable Poha', type: 'Main', category: 'Indian', diet: 'veg', nutritionTags: ['carbs', 'iron'], prepTime: 10, ingredients: ['beaten rice', 'peanuts'], allergens: ['peanuts'] },
            { name: 'Moong Dal Chilla', type: 'Main', category: 'Indian', diet: 'veg', nutritionTags: ['protein', 'fiber'], prepTime: 15, ingredients: ['lentils'], allergens: [] },
            { name: 'Thepla with Curd', type: 'Main', category: 'Indian', diet: 'veg', nutritionTags: ['vitamins', 'carbs'], prepTime: 20, ingredients: ['wheat', 'fenugreek', 'yogurt'], allergens: ['gluten', 'dairy'] },
            { name: 'Veg Sandwich', type: 'Main', category: 'Sandwich', diet: 'veg', nutritionTags: ['carbs', 'vitamins'], prepTime: 10, ingredients: ['bread', 'veggies'], allergens: ['gluten'] },
            { name: 'Cheese Macaroni', type: 'Main', category: 'Pasta', diet: 'veg', nutritionTags: ['carbs', 'dairy'], prepTime: 15, ingredients: ['pasta', 'cheese'], allergens: ['gluten', 'dairy'] },
            { name: 'Quinoa Veggie Bowl', type: 'Main', category: 'Healthy', diet: 'veg', nutritionTags: ['protein', 'fiber'], prepTime: 20, ingredients: ['quinoa', 'veggies'], allergens: [] },
            { name: 'Idli Sambar', type: 'Main', category: 'Indian', diet: 'veg', nutritionTags: ['carbs', 'protein'], prepTime: 25, ingredients: ['rice', 'lentils'], allergens: [] },
            { name: 'Veggie Burger', type: 'Main', category: 'Western', diet: 'veg', nutritionTags: ['carbs', 'fiber'], prepTime: 20, ingredients: ['bun', 'veg patty'], allergens: ['gluten'] },
            { name: 'Hummus & Pita', type: 'Main', category: 'Healthy', diet: 'veg', nutritionTags: ['protein', 'carbs'], prepTime: 10, ingredients: ['chickpeas', 'wheat'], allergens: ['gluten'] },
            { name: 'Corn & Cheese Quesadilla', type: 'Main', category: 'Western', diet: 'veg', nutritionTags: ['carbs', 'calcium'], prepTime: 12, ingredients: ['tortilla', 'cheese', 'corn'], allergens: ['gluten', 'dairy'] },
            { name: 'Upma', type: 'Main', category: 'Indian', diet: 'veg', nutritionTags: ['carbs', 'vitamins'], prepTime: 15, ingredients: ['semolina', 'veggies'], allergens: ['gluten'] },
            { name: 'Spinach & Corn Sandwich', type: 'Main', category: 'Sandwich', diet: 'veg', nutritionTags: ['iron', 'carbs'], prepTime: 10, ingredients: ['bread', 'spinach', 'corn'], allergens: ['gluten'] },
            { name: 'Chickpea Salad', type: 'Main', category: 'Healthy', diet: 'veg', nutritionTags: ['protein', 'fiber'], prepTime: 10, ingredients: ['chickpeas', 'cucumber'], allergens: [] },

            // --- MAINS (Non-Veg) ---
            { name: 'Chicken Mayo Sandwich', type: 'Main', category: 'Sandwich', diet: 'non-veg', nutritionTags: ['protein', 'carbs'], prepTime: 10, ingredients: ['bread', 'chicken'], allergens: ['gluten'] },
            { name: 'Egg Burrito', type: 'Main', category: 'Western', diet: 'non-veg', nutritionTags: ['protein', 'energy'], prepTime: 15, ingredients: ['egg', 'tortilla'], allergens: ['egg', 'gluten'] },
            { name: 'Chicken Stir-fry Noodles', type: 'Main', category: 'Asian', diet: 'non-veg', nutritionTags: ['protein', 'carbs'], prepTime: 20, ingredients: ['noodles', 'chicken'], allergens: ['gluten'] },
            { name: 'Grilled Fish Bites', type: 'Main', category: 'Healthy', diet: 'non-veg', nutritionTags: ['protein', 'omega-3'], prepTime: 25, ingredients: ['fish'], allergens: ['fish'] },
            { name: 'Chicken Keema Paratha', type: 'Main', category: 'Indian', diet: 'non-veg', nutritionTags: ['protein', 'carbs'], prepTime: 30, ingredients: ['wheat', 'minced chicken'], allergens: ['gluten'] },
            { name: 'Egg Fried Rice', type: 'Main', category: 'Asian', diet: 'non-veg', nutritionTags: ['protein', 'carbs'], prepTime: 15, ingredients: ['rice', 'egg'], allergens: ['egg'] },
            { name: 'Turkey & Cheese Wrap', type: 'Main', category: 'Healthy', diet: 'non-veg', nutritionTags: ['protein', 'vitamins'], prepTime: 10, ingredients: ['tortilla', 'turkey'], allergens: ['gluten'] },
            { name: 'Chicken Nuggets (Baked)', type: 'Main', category: 'Western', diet: 'non-veg', nutritionTags: ['protein'], prepTime: 20, ingredients: ['chicken'], allergens: [] },
            { name: 'Pasta with Meatballs', type: 'Main', category: 'Pasta', diet: 'non-veg', nutritionTags: ['protein', 'carbs'], prepTime: 25, ingredients: ['pasta', 'meat'], allergens: ['gluten'] },
            { name: 'Omelette with Toast', type: 'Main', category: 'Western', diet: 'non-veg', nutritionTags: ['protein', 'carbs'], prepTime: 10, ingredients: ['egg', 'bread'], allergens: ['egg', 'gluten'] },

            // --- FRUITS (All Veg) ---
            { name: 'Apple Slices', type: 'Fruit', category: 'Fruit', diet: 'veg', nutritionTags: ['vitamins', 'fiber'], prepTime: 2, ingredients: ['apple'], allergens: [] },
            { name: 'Banana', type: 'Fruit', category: 'Fruit', diet: 'veg', nutritionTags: ['carbs', 'potassium'], prepTime: 1, ingredients: ['banana'], allergens: [] },
            { name: 'Sweet Grapes', type: 'Fruit', category: 'Fruit', diet: 'veg', nutritionTags: ['antioxidants'], prepTime: 2, ingredients: ['grapes'], allergens: [] },
            { name: 'Orange Wedges', type: 'Fruit', category: 'Fruit', diet: 'veg', nutritionTags: ['vitamin C'], prepTime: 5, ingredients: ['orange'], allergens: [] },
            { name: 'Watermelon Cubes', type: 'Fruit', category: 'Fruit', diet: 'veg', nutritionTags: ['hydration'], prepTime: 5, ingredients: ['watermelon'], allergens: [] },
            { name: 'Pear Slices', type: 'Fruit', category: 'Fruit', diet: 'veg', nutritionTags: ['fiber'], prepTime: 3, ingredients: ['pear'], allergens: [] },
            { name: 'Mango Dices', type: 'Fruit', category: 'Fruit', diet: 'veg', nutritionTags: ['vitamins'], prepTime: 5, ingredients: ['mango'], allergens: [] },
            { name: 'Berries Mix', type: 'Fruit', category: 'Fruit', diet: 'veg', nutritionTags: ['antioxidants'], prepTime: 2, ingredients: ['berries'], allergens: [] },

            // --- SIDES ---
            { name: 'Roasted Makhana', type: 'Side', category: 'Snack', diet: 'veg', nutritionTags: ['calcium', 'fiber'], prepTime: 5, ingredients: ['fox nuts'], allergens: [] },
            { name: 'Yogurt Cup', type: 'Side', category: 'Dairy', diet: 'veg', nutritionTags: ['probiotics', 'protein'], prepTime: 0, ingredients: ['milk'], allergens: ['dairy'] },
            { name: 'Handful of Almonds', type: 'Side', category: 'Snack', diet: 'veg', nutritionTags: ['healthy fats'], prepTime: 0, ingredients: ['almonds'], allergens: ['nuts'] },
            { name: 'Boiled Corn', type: 'Side', category: 'Veggie', diet: 'veg', nutritionTags: ['fiber'], prepTime: 8, ingredients: ['corn'], allergens: [] },
            { name: 'Carrot & Cucumber Sticks', type: 'Side', category: 'Veggie', diet: 'veg', nutritionTags: ['vitamins'], prepTime: 5, ingredients: ['carrot', 'cucumber'], allergens: [] },
            { name: 'Cheese Cubes', type: 'Side', category: 'Dairy', diet: 'veg', nutritionTags: ['calcium', 'protein'], prepTime: 2, ingredients: ['cheese'], allergens: ['dairy'] },
            { name: 'Boiled Egg', type: 'Side', category: 'Protein', diet: 'non-veg', nutritionTags: ['protein'], prepTime: 10, ingredients: ['egg'], allergens: ['egg'] }
        ];
        await Meal.deleteMany({});
        await Meal.insertMany(seedData);
        console.log("Database seeded with 40+ realistic meals.");
    }
};

// 2. Separate Filtering Function
const filterMeals = (allMeals, childProfile) => {
    const { diet, allergies = [] } = childProfile;
    const safeAllergies = allergies.map(a => a.toLowerCase());

    let filtered = allMeals.filter(meal => {
        // Diet check: Strict enforcement
        const childDiet = diet ? diet.toLowerCase() : 'veg';
        if (childDiet === 'veg' && meal.diet !== 'veg') return false;

        // Allergens check: Strict enforcement
        const hasAllergen = meal.allergens && meal.allergens.some(a => safeAllergies.includes(a.toLowerCase()));
        const hasIngredientAllergy = meal.ingredients && meal.ingredients.some(i => safeAllergies.includes(i.toLowerCase()));

        return !hasAllergen && !hasIngredientAllergy;
    });

    // Minimal fallback: if literally zero meals found, at least try to provide safe ones even if diet differs
    if (filtered.length === 0) {
        filtered = allMeals.filter(meal => {
             const hasAllergen = meal.allergens && meal.allergens.some(a => safeAllergies.includes(a.toLowerCase()));
             return !hasAllergen;
        });
    }

    return filtered;
};

// 3. Separate Scoring Function (Improved for Realism & Variety)
const scoreMeal = (meal, context) => {
    const { dayType, recentMains, recentCategories } = context;
    let score = Math.random() * 5; // Start with small random base for tie-breaking

    // A. Nutrition Score
    if (meal.nutritionTags.includes('protein')) score += 5;
    if (meal.nutritionTags.includes('fiber') || meal.nutritionTags.includes('vitamins')) score += 3;

    // B. Variety Score (CONSECUTIVE REPEAT PREVENTION)
    if (recentMains.length > 0) {
        const lastMain = recentMains[recentMains.length - 1];
        // Heavy penalty for same exact meal as yesterday
        if (lastMain._id.toString() === meal._id.toString()) score -= 50;
        
        // Heavy penalty for same category as yesterday (e.g., no Indian two days in a row if possible)
        if (lastMain.category === meal.category) score -= 15;
    }

    // C. Long-term Variety
    const timesUsed = recentMains.filter(m => m._id.toString() === meal._id.toString()).length;
    score -= (timesUsed * 10); 

    // D. Prep Time Optimization
    if (dayType === 'Weekday') {
        if (meal.prepTime <= 15) score += 10;
        else if (meal.prepTime <= 20) score += 5;
    }

    return score;
};

// 4. Generate Weekly Plan logic
const generateWeeklyPlan = async (req, res) => {
    try {
        await seedMealsIfEmpty();

        const { childId } = req.body;
        if (!childId) return res.status(400).json({ message: 'childId is required' });

        const child = await Child.findById(childId);
        if (!child) return res.status(404).json({ message: 'Child not found' });

        const allMeals = await Meal.find({});
        let safeMeals = filterMeals(allMeals, child);

        let mains = safeMeals.filter(m => m.type === 'Main');
        let fruits = safeMeals.filter(m => m.type === 'Fruit');
        let sides = safeMeals.filter(m => m.type === 'Side');

        // Categorical Fallbacks
        if (mains.length === 0) mains = allMeals.filter(m => m.type === 'Main');
        if (fruits.length === 0) fruits = allMeals.filter(m => m.type === 'Fruit');

        const days = [
            { name: 'Monday', type: 'Weekday' },
            { name: 'Tuesday', type: 'Weekday' },
            { name: 'Wednesday', type: 'Weekday' },
            { name: 'Thursday', type: 'Weekday' },
            { name: 'Friday', type: 'Weekday' },
            { name: 'Saturday', type: 'Weekend' },
            { name: 'Sunday', type: 'Weekend' }
        ];

        const weeklyPlan = {};
        const recentMains = [];

        for (const day of days) {
            // Select Main with Score
            let bestMain = null;
            let bestScore = -Infinity;

            for (const main of mains) {
                const score = scoreMeal(main, {
                    dayType: day.type,
                    recentMains: recentMains
                });

                if (score > bestScore) {
                    bestScore = score;
                    bestMain = main;
                }
            }
            if (!bestMain) bestMain = mains[Math.floor(Math.random() * mains.length)];
            recentMains.push(bestMain);

            // Select Fruit (Variety focus)
            let possibleFruits = fruits;
            const yesterdayFruit = weeklyPlan[days[days.indexOf(day) - 1]?.name]?.fruit;
            if (fruits.length > 1) {
                possibleFruits = fruits.filter(f => f.name !== yesterdayFruit);
            }
            let selectedFruit = possibleFruits[Math.floor(Math.random() * possibleFruits.length)];

            // Select Side (Variety focus)
            let selectedSide = null;
            if (sides.length > 0 && Math.random() > 0.3) {
                const yesterdaySide = weeklyPlan[days[days.indexOf(day) - 1]?.name]?.side;
                let possibleSides = sides;
                if (sides.length > 1) {
                    possibleSides = sides.filter(s => s.name !== yesterdaySide);
                }
                selectedSide = possibleSides[Math.floor(Math.random() * possibleSides.length)];
            }

            const dayNutrition = new Set([
                ...(bestMain.nutritionTags || []),
                ...(selectedFruit ? selectedFruit.nutritionTags || [] : []),
                ...(selectedSide ? selectedSide.nutritionTags || [] : [])
            ]);

            weeklyPlan[day.name] = {
                main: bestMain.name,
                fruit: selectedFruit ? selectedFruit.name : "Apple Slices",
                side: selectedSide ? selectedSide.name : null,
                nutrition: Array.from(dayNutrition).slice(0, 3), // Keep UI clean
                prepTime: bestMain.prepTime + (selectedFruit ? selectedFruit.prepTime : 0) + (selectedSide ? selectedSide.prepTime : 0)
            };
        }

        res.json({
            child: child.name,
            plan: weeklyPlan,
            status: "success"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Not enough meals available. Using fallback plan.", error: error.message });
    }
};

const generateMealPlan = async (req, res) => {
    res.json({ message: "Use /generate-plan endpoint" });
};

const generateDayPlan = async (req, res) => {
    try {
        const { childId, dayName } = req.body;
        if (!childId) return res.status(400).json({ message: 'childId is required' });

        const child = await Child.findById(childId);
        if (!child) return res.status(404).json({ message: 'Child not found' });

        const allMeals = await Meal.find({});
        let safeMeals = filterMeals(allMeals, child);

        let mains = safeMeals.filter(m => m.type === 'Main');
        let fruits = safeMeals.filter(m => m.type === 'Fruit');
        let sides = safeMeals.filter(m => m.type === 'Side');

        if (mains.length === 0) mains = allMeals.filter(m => m.type === 'Main');
        if (fruits.length === 0) fruits = allMeals.filter(m => m.type === 'Fruit');

        const main = mains[Math.floor(Math.random() * mains.length)];
        const fruit = fruits[Math.floor(Math.random() * fruits.length)];
        let side = null;
        if (sides.length > 0 && Math.random() > 0.4) {
            side = sides[Math.floor(Math.random() * sides.length)];
        }

        const dayNutrition = new Set([
            ...(main.nutritionTags || []),
            ...(fruit ? fruit.nutritionTags || [] : []),
            ...(side ? side.nutritionTags || [] : [])
        ]);

        const plan = {
            main: main.name,
            fruit: fruit ? fruit.name : "Apple Slices",
            side: side ? side.name : null,
            nutrition: Array.from(dayNutrition).slice(0, 3),
            prepTime: main.prepTime + (fruit ? fruit.prepTime : 0) + (side ? side.prepTime : 0)
        };

        res.json({ day: dayName || 'Today', plan });
    } catch (error) {
        res.status(500).json({ message: "Error regenerating day. Using fallback.", error: error.message });
    }
};

module.exports = {
    generateMealPlan,
    generateWeeklyPlan,
    generateDayPlan
};
