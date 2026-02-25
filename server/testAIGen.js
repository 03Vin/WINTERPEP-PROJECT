const mongoose = require('mongoose');
const User = require('./models/User');
const Timetable = require('./models/Timetable');
const { solveClashes } = require('./controllers/timetableController');
require('dotenv').config();

async function testGeneration() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('--- Simulating AI Generation for Section K26SF ---');

        // Mock req and res
        const req = {
            body: { section: 'K26SF' }
        };
        const res = {
            status: (code) => ({ json: (data) => console.log(`Response ${code}:`, data) }),
            json: (data) => console.log('Response 200:', data.message)
        };

        await solveClashes(req, res);

        // Verify in DB
        const monday = await Timetable.findOne({ day: 'Monday' });
        const k26sfSlots = monday.slots.filter(s => s.classId === 'K26SF');
        console.log(`Generated ${k26sfSlots.length} slots for K26SF on Monday.`);

        if (k26sfSlots.length > 0) {
            console.log('Sample Slot:', k26sfSlots[0].subject, 'by', k26sfSlots[0].teacher);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testGeneration();
