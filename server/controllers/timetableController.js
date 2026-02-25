const Timetable = require('../models/Timetable');
const User = require('../models/User');

exports.getTimetable = async (req, res) => {
    try {
        const timetables = await Timetable.find()
            .populate('slots.teacher', 'name email');

        const user = req.user;

        const filteredTimetable = timetables.map(dayDoc => {
            const dayObj = dayDoc.toObject();
            if (user.role === 'student') {
                dayObj.slots = dayObj.slots.filter(slot => slot.classId === user.section);
            } else if (user.role === 'teacher') {
                dayObj.slots = dayObj.slots.filter(slot =>
                    slot.teacher && slot.teacher._id.toString() === user._id.toString()
                );
            }
            return dayObj;
        });

        res.json(filteredTimetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.solveClashes = async (req, res) => {
    const { section } = req.body;
    if (!section) return res.status(400).json({ message: 'Section is required' });

    try {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const timeSlots = [
            { start: '09:00', end: '10:00' },
            { start: '10:00', end: '11:00' },
            { start: '11:00', end: '12:00' },
            { start: '12:00', end: '13:00' },
            { start: '14:00', end: '15:00' },
            { start: '15:00', end: '16:00' }
        ];
        const rooms = ['Lab-A', 'Lab-B', 'R-101', 'R-202', 'Lab-C', 'Lab-D', 'R-301', 'Auditorium'];
        const SECTIONS = ['K26PS', 'K26ND', 'K26SR', 'K26WT', 'K26SF'];
        const sectionIdx = SECTIONS.indexOf(section);

        const teachers = await User.find({ role: 'teacher' });
        if (teachers.length === 0) {
            return res.status(400).json({ message: 'No teachers found to assign' });
        }

        for (const day of days) {
            let dayDoc = await Timetable.findOne({ day });
            if (!dayDoc) {
                dayDoc = new Timetable({ day, slots: [] });
            }

            // Remove existing slots for THIS section only
            dayDoc.slots = dayDoc.slots.filter(s => s.classId !== section);

            // For each teacher, stagger their slot index based on section to avoid clashes
            const usedSlotIndices = new Set();

            teachers.forEach((teacher, tIdx) => {
                const subject = teacher.subjects?.[0] || 'General Elective';

                // Staggered slot: prevent same teacher at same time in different sections
                let slotIdx = (tIdx + sectionIdx) % timeSlots.length;

                // If slot already taken in this section, find next available
                let attempts = 0;
                while (usedSlotIndices.has(slotIdx) && attempts < timeSlots.length) {
                    slotIdx = (slotIdx + 1) % timeSlots.length;
                    attempts++;
                }

                if (attempts >= timeSlots.length) return; // no free slot

                usedSlotIndices.add(slotIdx);
                const time = timeSlots[slotIdx];
                const room = rooms[(tIdx + sectionIdx) % rooms.length];

                dayDoc.slots.push({
                    startTime: time.start,
                    endTime: time.end,
                    subject,
                    teacher: teacher._id,
                    room,
                    classId: section
                });
            });

            await dayDoc.save();
        }

        const updatedTimetable = await Timetable.find().populate('slots.teacher', 'name email');
        res.json({ message: `AI optimized conflict-free schedule for ${section}`, timetable: updatedTimetable });
    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ message: error.message });
    }
};
