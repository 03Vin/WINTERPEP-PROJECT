const express = require('express');
const router = express.Router();
const { getResourcesBySubject, getAllResources } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/all', protect, getAllResources);
router.get('/:subjectId', protect, getResourcesBySubject);

module.exports = router;
