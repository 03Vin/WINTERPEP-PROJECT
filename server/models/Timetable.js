const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
    slots: [{
        startTime: String,
        endTime: String,
        subject: String,
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        room: String,
        classId: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
