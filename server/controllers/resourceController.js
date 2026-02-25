const Resource = require('../models/Resource');

exports.getResourcesBySubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        // Search by subject code (e.g., INT656) or partial match
        const resources = await Resource.find({
            subjectId: { $regex: subjectId, $options: 'i' }
        });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
