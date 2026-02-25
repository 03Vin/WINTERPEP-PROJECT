const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function repairPasswords() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const students = await User.find({ role: 'student' });
        console.log(`Repairing passwords for ${students.length} students...`);

        // We bypass the pre-save hook by using updateOne or by setting the password directly without re-saving the whole doc if it auto-hashes
        // Actually, User.create calls .save() which triggers the hook. 
        // If we want to set it correctly, we should just set the PLAIN TEXT password and let the hook hash it,
        // OR set the hash and use findOneAndUpdate (which doesn't trigger save hooks generally, unless configured).

        // Let's use the safest way: set plain text and save.
        for (const student of students) {
            student.password = 'Lpu@123';
            await student.save();
        }

        console.log('--- Repair Complete ---');

        // Final verification for one
        const testUser = await User.findOne({ email: 'shaurya.kumar260031@lpu.in' });
        const isMatch = await bcrypt.compare('Lpu@123', testUser.password);
        console.log(`Verification for ${testUser.email}: ${isMatch ? 'PASSED' : 'FAILED'}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

repairPasswords();
