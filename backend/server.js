const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Feedback = require('./models/Feedback');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// ==========================================
// 🚀 THE ULTIMATE SUPPORT ROUTE (PORT 5001)
// ==========================================
app.all('/api/support/ticket', async (req, res) => {
    console.log("🔥 HIT DETECTED ON SUPPORT ROUTE!");
    try {
        const { parentName, parentEmail, topic, message } = req.body;
        if (req.method === 'GET') return res.json({ status: "online", msg: "Support API is Live" });
        
        const ticket = await Feedback.create({ parentName, parentEmail, topic, message });
        console.log("✅ TICKET SAVED:", ticket._id);
        res.status(201).json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin Reply Route
const { protect } = require('./middleware/authMiddleware');
app.post('/api/support/reply/:id', protect, async (req, res) => {
    try {
        const ADMIN_EMAILS = ['owner@tiffingenie.com', 'admin@tiffingenie.com', 'adhyatmika3@gmail.com'];
        if (req.user.role !== 'admin' && !ADMIN_EMAILS.includes(req.user.email)) {
            return res.status(403).json({ message: 'Admin only' });
        }
        const { response } = req.body;
        const ticket = await Feedback.findByIdAndUpdate(req.params.id, {
            adminResponse: response,
            status: 'Resolved',
            isReadByParent: false
        }, { new: true });
        res.json(ticket);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Parent Notifications Route
app.get('/api/support/notifications', protect, async (req, res) => {
    try {
        const tickets = await Feedback.find({ 
            parentEmail: req.user.email, 
            adminResponse: { $ne: '' },
            isReadByParent: false 
        }).sort({ updatedAt: -1 });
        res.json(tickets);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Mark Read Route
app.post('/api/support/mark-read', protect, async (req, res) => {
    try {
        await Feedback.updateMany(
            { parentEmail: req.user.email, isReadByParent: false },
            { isReadByParent: true }
        );
        res.json({ message: 'Notifications cleared' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin Route to view all
app.get('/api/support/tickets', protect, async (req, res) => {
    const tickets = await Feedback.find({}).sort({ createdAt: -1 });
    res.json(tickets);
});

// OTHER ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api', require('./routes/profileRoutes'));
app.use('/api', require('./routes/mealPlanRoutes'));
app.use('/api', require('./routes/metaRoutes'));

app.use((req, res) => {
    console.log("⚠️ 404:", req.url);
    res.status(404).json({ message: "Route not found" });
});

// CHANGING PORT TO 5001 TO AVOID CONFLICTS
const PORT = 5001; 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n***************************************`);
    console.log(`🚀 GENIE MASTER SERVER LIVE ON PORT ${PORT}`);
    console.log(`🚀 USE: http://127.0.0.1:${PORT}/api/support/ticket`);
    console.log(`***************************************\n`);
});
