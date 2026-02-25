const express = require('express');
const router = express.Router();
const { getCurriculumProgress, updateTopicStatus } = require('../controllers/curriculumController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/progress', protect, getCurriculumProgress);
router.put('/update-topic', protect, authorize('teacher'), updateTopicStatus);

module.exports = router;
