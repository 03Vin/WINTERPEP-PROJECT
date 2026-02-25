const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    subjectId: {
        type: String, // e.g., 'INT656'
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['PDF', 'Video', 'Link'],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    size: {
        type: String, // e.g., '2.4 MB' or '15:20 min'
        default: ''
    },
    category: {
        type: String,
        enum: ['Notes', 'Lab', 'Video', 'Reference'],
        default: 'Notes'
    },
    provider: {
        type: String, // e.g., 'freeCodeCamp' or 'MIT OCW'
        default: 'AIvent Library'
    },
    topics: [{
        type: String // Associated syllabus topic IDs
    }]
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
