const mongoose = require('mongoose');
const Timetable = require('./models/Timetable');
require('dotenv').config();

async function checkTimetable() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Timetable.countDocuments();
        console.log('Total Timetable Entries:', count);

        if (count > 0) {
            const sample = await Timetable.findOne().populate('slots.teacher');
            console.log('Sample Timetable Entry:', JSON.stringify(sample, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTimetable();
