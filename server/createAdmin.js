const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = 'vinay.admin@edu.in';
        const hashedPassword = await bcrypt.hash('12345678', 10);

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('User already exists. Updating to admin...');
            existing.role = 'admin';
            existing.password = hashedPassword;
            existing.name = 'Vinay';
            await existing.save();
            console.log('Admin updated successfully.');
        } else {
            const admin = new User({
                name: 'Vinay',
                email: email,
                password: '12345678', // The pre-save hook will hash this, but I'll double check the model
                role: 'admin'
            });
            await admin.save();
            console.log('Admin created successfully.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createAdmin();
