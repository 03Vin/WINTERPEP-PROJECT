const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const teachers = [
    {
        name: 'Mukti Verma',
        email: 'mukti@edu.com',
        password: 'Teacher@123',
        role: 'teacher',
        subjects: ['INT656 : ADVANCED WEB DEVELOPENT'],
        department: 'Computer Science'
    },
    {
        name: 'Prashant Singh',
        email: 'prashant@edu.com',
        password: 'Teacher@123',
        role: 'teacher',
        subjects: ['INT545 : WEB APP DEVELOPMENT WITH REACTJS'],
        department: 'Computer Science'
    },
    {
        name: 'Ajay Kumar',
        email: 'ajay@edu.com',
        password: 'Teacher@123',
        role: 'teacher',
        subjects: ['PEA333 : ANALYTICAL SKILLS'],
        department: 'Soft Skills'
    },
    {
        name: 'Ridhima Shrivastava',
        email: 'ridhima@edu.com',
        password: 'Teacher@123',
        role: 'teacher',
        subjects: ['MTH290 : PROBABILITY AND STATISTICS'],
        department: 'Mathematics'
    },
    {
        name: 'Aditya Singh',
        email: 'aditya@edu.com',
        password: 'Teacher@123',
        role: 'teacher',
        subjects: ['CSE202 : PROGRAMMING IN C++'],
        department: 'Computer Science'
    },
    {
        name: 'Sanjana',
        email: 'sanjana@edu.com',
        password: 'Teacher@123',
        role: 'teacher',
        subjects: ['CSE205 : DATA STUCTURES AND ALGORITHMS'],
        department: 'Computer Science'
    },
    {
        name: 'Mohit Sharma',
        email: 'mohit@edu.com',
        password: 'Teacher@123',
        role: 'teacher',
        subjects: ['CSE306 : COMPUTER NETWORKS'],
        department: 'Computer Science'
    },
    {
        name: 'Mukul Raj',
        email: 'mukul@edu.com',
        password: 'Teacher@123',
        role: 'teacher',
        subjects: ['PEL136 : COMMUNICATION SKILLS'],
        department: 'English'
    }
];

const seedTeachers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Remove only role 'teacher'
        await User.deleteMany({ role: 'teacher' });
        console.log('Removed old teachers.');

        // Insert new teachers
        // Note: Password hashing is handled by pre-save hook in User model
        for (const t of teachers) {
            await User.create(t);
        }

        console.log('Successfully seeded 8 specific teachers!');
        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedTeachers();
