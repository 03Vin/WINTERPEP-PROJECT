const crypto = require('crypto');
const AttendanceSession = require('../models/AttendanceSession');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Helper to generate a 10-second rotating token
const generateToken = (secret) => {
    const timeWindow = Math.floor(Date.now() / 10000); // 10s window
    return crypto.createHmac('sha256', secret)
        .update(timeWindow.toString())
        .digest('hex')
        .substring(0, 8); // 8-char short token
};

// Start a live attendance session
exports.startSession = async (req, res) => {
    try {
        const { section, subject } = req.body;
        const secret = crypto.randomBytes(16).toString('hex');

        // 10-minute expiry
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const session = await AttendanceSession.create({
            section,
            subject,
            teacher: req.user.id,
            secret,
            expiresAt
        });

        res.json({
            success: true,
            sessionId: session._id,
            expiresAt
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get the latest rotating QR token
exports.getQRToken = async (req, res) => {
    try {
        const session = await AttendanceSession.findById(req.params.sessionId);
        if (!session || !session.isActive) {
            return res.status(404).json({ message: 'Session expired or inactive' });
        }

        const token = generateToken(session.secret);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Student marks attendance via Dynamic QR
exports.verifyQRMark = async (req, res) => {
    try {
        const { sessionId, token, metadata } = req.body;
        let session;

        if (sessionId && sessionId !== 'FIND_ACTIVE_BY_SECTION') {
            session = await AttendanceSession.findById(sessionId);
        } else {
            // Find active session for the student's section
            const student = await User.findById(req.user.id);
            session = await AttendanceSession.findOne({
                section: student.section,
                isActive: true,
                expiresAt: { $gt: new Date() }
            });
        }

        if (!session) {
            return res.status(404).json({ message: 'No active session found for your section' });
        }

        // Verify token (current and previous window)
        const currentToken = generateToken(session.secret);
        const prevTimeWindow = Math.floor(Date.now() / 10000) - 1;
        const prevToken = crypto.createHmac('sha256', session.secret)
            .update(prevTimeWindow.toString())
            .digest('hex')
            .substring(0, 8);

        if (token !== currentToken && token !== prevToken) {
            return res.status(401).json({ message: 'QR Code Expired. Please scan the latest one.' });
        }

        // Check if already marked
        const exists = await Attendance.findOne({
            student: req.user.id,
            session: sessionId
        });
        if (exists) return res.status(400).json({ message: 'Attendance already marked' });

        // Create attendance record
        const attendance = await Attendance.create({
            student: req.user.id,
            section: session.section,
            subject: session.subject,
            teacher: session.teacher,
            markingMethod: 'qr',
            session: sessionId,
            metadata
        });

        res.json({ success: true, attendance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all students who marked via QR for this session
exports.getSessionMarks = async (req, res) => {
    try {
        const attendance = await Attendance.find({ session: req.params.sessionId })
            .select('student status timestamps');
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Close session manually
exports.closeSession = async (req, res) => {
    try {
        const session = await AttendanceSession.findByIdAndUpdate(req.params.sessionId, { isActive: false });
        res.json({ success: true, message: 'Session closed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
