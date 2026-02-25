const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topics: [{
        title: String,
        completed: { type: Boolean, default: false },
        completionDate: Date,
        resources: [String]
    }],
    totalTopics: { type: Number, required: true },
    completedTopics: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Curriculum', curriculumSchema);
