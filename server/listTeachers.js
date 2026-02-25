const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function listAllTeachers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const teachers = await User.find({ role: 'teacher' }).select('name email subjects _id');
        console.log(JSON.stringify(teachers, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listAllTeachers();
