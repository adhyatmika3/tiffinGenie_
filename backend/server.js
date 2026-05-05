const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Routes (to be loaded)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/profileRoutes'));
app.use('/api', require('./routes/mealPlanRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api', require('./routes/metaRoutes'));

app.get('/', (req, res) => {
    res.status(200).json({ status: "success", message: "TiffinGenie API is running securely!" });
});

// Global 404 JSON handler
app.use((req, res) => {
    res.status(404).json({ status: "error", message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
