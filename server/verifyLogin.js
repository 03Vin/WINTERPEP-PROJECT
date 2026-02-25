const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function verifyLogin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'shaurya.kumar260031@lpu.in';
        const password = 'Lpu@123';

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User not found: ${email}`);
            process.exit(1);
        }

        console.log('User found:', user.name);
        console.log('Role:', user.role);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch);

        if (!isMatch) {
            console.log('Stored Hash:', user.password);
            // Let's check if the hash was generated with 10 rounds as expected
            const testHash = await bcrypt.hash(password, 10);
            console.log('Expected Hash (new):', testHash);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verifyLogin();
