const mongoose = require('mongoose');
const User = require('./models/User');
const fs = require('fs');
require('dotenv').config();

async function exportCredentials() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const students = await User.find({ role: 'student' }).select('name email studentId section');

        let content = '# Student Credentials List\n\n';
        content += '| Section | Name | Email | Student ID | Password |\n';
        content += '|---------|------|-------|------------|----------|\n';

        students.sort((a, b) => a.section.localeCompare(b.section)).forEach(s => {
            content += `| ${s.section} | ${s.name} | ${s.email} | ${s.studentId} | Lpu@123 |\n`;
        });

        fs.writeFileSync('student_credentials.md', content, 'utf8');
        console.log('File student_credentials.md created successfully.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

exportCredentials();
