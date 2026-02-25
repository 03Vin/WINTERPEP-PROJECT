const mongoose = require('mongoose');
const Timetable = require('./models/Timetable');
require('dotenv').config();

async function verifySync() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const monday = await Timetable.findOne({ day: 'Monday' }).populate('slots.teacher');

        console.log('--- Monday Timetable Sync Check ---');
        monday.slots.slice(0, 3).forEach(slot => {
            console.log(`Slot: ${slot.startTime}-${slot.endTime} | Subject: ${slot.subject} | Sec: ${slot.classId} | Teacher: ${slot.teacher?.name}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verifySync();
