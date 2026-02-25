const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.bulkMarkAttendance = async (req, res) => {
    const { students, section, subject, metadata } = req.body;
    try {
        const records = students.map(s => ({
            student: s.id,
            section,
            subject,
            teacher: req.user._id,
            status: s.status || 'present',
            metadata: {
                ipAddress: metadata?.ip || req.ip,
                deviceFingerprint: metadata?.fingerprint || 'WEB_CLIENT_LEGACY',
                confidenceScore: 100
            }
        }));
        await Attendance.insertMany(records);
        res.status(201).json({ message: 'Attendance marked successfully', count: records.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSectionRoster = async (req, res) => {
    const { section } = req.params;
    try {
        console.log(`Fetching roster for section: ${section}`);
        const students = await User.find({ role: 'student', section }).select('name studentId rollNumber');
        console.log(`Found ${students.length} students`);
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAttendance = async (req, res) => {
    const { studentId, subject, section } = req.body;
    try {
        const student = await User.findOne({ studentId });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const attendance = await Attendance.create({
            student: student._id,
            subject,
            section,
            teacher: req.user._id,
            status: 'present'
        });
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ student: req.user._id });
        const stats = calculateAttendanceStats(attendance);
        res.json({ attendance, stats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function calculateAttendanceStats(records) {
    const subjects = {};
    records.forEach(r => {
        if (!subjects[r.subject]) subjects[r.subject] = { present: 0, total: 0 };
        subjects[r.subject].total++;
        if (r.status === 'present') subjects[r.subject].present++;
    });

    // AI Prediction Logic (Simplified Forecast)
    Object.keys(subjects).forEach(sub => {
        const s = subjects[sub];
        s.percentage = (s.present / s.total) * 100;
        // Forecast: If they continue this trend for 10 more classes
        const projectedPresent = s.present + (s.present / s.total) * 10;
        s.projectedPercentage = (projectedPresent / (s.total + 10)) * 100;
    });

    return subjects;
}
