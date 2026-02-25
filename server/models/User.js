const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
    department: { type: String },
    section: { type: String, enum: ['K26PS', 'K26ND', 'K26SR', 'K26WT', 'K26SF'] },
    studentId: { type: String }, // For students
    rollNumber: { type: String }, // For students
    subjects: [{ type: String }], // For teachers and students
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
