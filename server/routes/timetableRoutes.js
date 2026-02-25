const express = require('express');
const router = express.Router();
const { getTimetable, solveClashes } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getTimetable);
router.post('/optimize', protect, authorize('admin', 'teacher'), solveClashes);

module.exports = router;
