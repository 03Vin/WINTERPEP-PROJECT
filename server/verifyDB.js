const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- DB Check ---');
        console.log('URI:', process.env.MONGO_URI);

        const count = await User.countDocuments();
        console.log('Total Users:', count);

        const studentCount = await User.countDocuments({ role: 'student' });
        console.log('Total Students:', studentCount);

        const sections = ['K26PS', 'K26ND', 'K26SR', 'K26WT', 'K26SF'];
        for (const s of sections) {
            const sc = await User.countDocuments({ role: 'student', section: s });
            console.log(`Section ${s}: ${sc} students`);
        }

        const oneStudent = await User.findOne({ role: 'student' });
        console.log('Sample Student:', JSON.stringify(oneStudent, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
