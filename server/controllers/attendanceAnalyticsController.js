const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Calculate Dropout Risk based on attendance velocity
exports.getRiskAssessment = async (req, res) => {
    const { section } = req.params;
    try {
        const students = await User.find({ role: 'student', section }).select('_id name studentId rollNumber');
        const assessment = [];

        for (const student of students) {
            const records = await Attendance.find({ student: student._id }).sort({ date: -1 });

            if (records.length === 0) {
                assessment.push({ ...student._doc, riskScore: 0, status: 'stable', reason: 'Fresh record' });
                continue;
            }

            // Behavioral Pattern Analysis
            const recent = records.slice(0, 5);
            const recentPresent = recent.filter(r => r.status === 'present').length;
            const overallPresent = records.filter(r => r.status === 'present').length;

            const recentRate = (recentPresent / recent.length) * 100;
            const overallRate = (overallPresent / records.length) * 100;

            // Velocity: Negative if declining
            const velocity = recentRate - overallRate;

            let riskScore = 0;
            let status = 'stable';
            let reason = 'Steady attendance';

            if (velocity < -10) {
                riskScore = Math.abs(velocity) * 2;
                status = 'irregular';
                reason = 'Declining consistency';
            }

            if (recentRate < 75) {
                riskScore += (75 - recentRate) * 1.5;
                status = 'critical';
                reason = 'Below dynamic threshold';
            }

            assessment.push({
                ...student._doc,
                riskScore: Math.min(Math.round(riskScore), 100),
                status,
                reason,
                recentRate: Math.round(recentRate),
                overallRate: Math.round(overallRate)
            });
        }

        res.json(assessment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Detect Proxy Fraud Patterns (Share IP/Device)
exports.detectProxyFraud = async (req, res) => {
    const { section } = req.params;
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const records = await Attendance.find({
            section,
            date: { $gte: today }
        }).populate('student', 'name studentId');

        const ipGroups = {};
        const deviceGroups = {};

        records.forEach(r => {
            const ip = r.metadata?.ipAddress;
            const device = r.metadata?.deviceFingerprint;

            if (ip) {
                if (!ipGroups[ip]) ipGroups[ip] = [];
                ipGroups[ip].push(r);
            }
            if (device) {
                if (!deviceGroups[device]) deviceGroups[device] = [];
                deviceGroups[device].push(r);
            }
        });

        // Flag if more than 2 students use same IP/Device (allowing for some NAT/Shared devices)
        const flags = [];

        Object.keys(ipGroups).forEach(ip => {
            if (ipGroups[ip].length > 2) {
                flags.push({
                    type: 'SHARED_IP',
                    value: ip,
                    count: ipGroups[ip].length,
                    students: ipGroups[ip].map(r => r.student.name)
                });
            }
        });

        res.json({ flags, stats: { totalRecords: records.length } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get deep behavioral insights for a student
exports.getStudentInsights = async (req, res) => {
    const { studentId } = req.params;
    try {
        const records = await Attendance.find({ student: studentId }).sort({ date: 1 });

        const dayStats = {};
        records.forEach(r => {
            const day = new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' });
            if (!dayStats[day]) dayStats[day] = { total: 0, absent: 0 };
            dayStats[day].total++;
            if (r.status === 'absent') dayStats[day].absent++;
        });

        const patterns = Object.keys(dayStats).map(day => ({
            day,
            absentRate: Math.round((dayStats[day].absent / dayStats[day].total) * 100)
        })).filter(p => p.absentRate > 50);

        res.json({
            studentId,
            lapsePatterns: patterns, // e.g., [{"day": "Monday", "absentRate": 60}]
            totalSessions: records.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
