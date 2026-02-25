const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/curriculum', require('./routes/curriculumRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('Academic Management API is running...');
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/academic-system';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err);
    });
