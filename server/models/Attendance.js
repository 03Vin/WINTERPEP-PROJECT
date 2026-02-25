const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    markingMethod: {
        type: String,
        enum: ['teacher', 'self', 'qr'],
        default: 'teacher'
    },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession' },
    location: {
        lat: Number,
        lng: Number
    },
    metadata: {
        ipAddress: String,
        deviceFingerprint: String,
        confidenceScore: { type: Number, default: 100 },
        behavioralFlags: [String] // e.g., 'PROXY_DETECTED', 'PATTERN_SHIFT'
    }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
