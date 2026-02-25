const express = require('express');
const router = express.Router();
const {
    markAttendance,
    getStudentAttendance,
    bulkMarkAttendance,
    getSectionRoster
} = require('../controllers/attendanceController');
const {
    getRiskAssessment,
    detectProxyFraud,
    getStudentInsights
} = require('../controllers/attendanceAnalyticsController');
const {
    startSession,
    getQRToken,
    verifyQRMark,
    closeSession,
    getSessionMarks
} = require('../controllers/attendanceSessionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/mark', protect, authorize('teacher', 'admin'), markAttendance);
router.post('/bulk-mark', protect, authorize('teacher', 'admin'), bulkMarkAttendance);
router.get('/roster/:section', protect, authorize('teacher', 'admin'), getSectionRoster);
router.get('/my-attendance', protect, authorize('student'), getStudentAttendance);

// Dynamic QR Sessions
router.post('/session/start', protect, authorize('teacher', 'admin'), startSession);
router.get('/session/token/:sessionId', protect, authorize('teacher', 'admin'), getQRToken);
router.post('/session/verify', protect, authorize('student'), verifyQRMark);
router.post('/session/close/:sessionId', protect, authorize('teacher', 'admin'), closeSession);
router.get('/session/marks/:sessionId', protect, authorize('teacher', 'admin'), getSessionMarks);

// Behavioral & Fraud Analytics
router.get('/analytics/risk/:section', protect, authorize('teacher', 'admin'), getRiskAssessment);
router.get('/analytics/fraud/:section', protect, authorize('teacher', 'admin'), detectProxyFraud);
router.get('/analytics/insights/:studentId', protect, authorize('teacher', 'admin'), getStudentInsights);

module.exports = router;
