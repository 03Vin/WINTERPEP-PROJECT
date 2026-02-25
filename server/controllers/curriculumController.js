const Curriculum = require('../models/Curriculum');

exports.getCurriculumProgress = async (req, res) => {
    try {
        const progress = await Curriculum.find({ subject: { $in: req.user.subjects } });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTopicStatus = async (req, res) => {
    const { curriculumId, topicId, completed } = req.body;
    try {
        const curriculum = await Curriculum.findById(curriculumId);
        const topic = curriculum.topics.id(topicId);
        topic.completed = completed;
        topic.completionDate = completed ? new Date() : null;

        curriculum.completedTopics = curriculum.topics.filter(t => t.completed).length;
        await curriculum.save();

        // AI Prediction: Forecast completion date
        const daysSinceStart = (new Date() - curriculum.createdAt) / (1000 * 60 * 60 * 24);
        const velocity = curriculum.completedTopics / (daysSinceStart || 1);
        const remainingTopics = curriculum.totalTopics - curriculum.completedTopics;
        const daysToComplete = velocity > 0 ? remainingTopics / velocity : Infinity;

        res.json({ curriculum, forecast: { daysToComplete, estimatedCompletion: new Date(Date.now() + daysToComplete * 24 * 60 * 60 * 1000) } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
