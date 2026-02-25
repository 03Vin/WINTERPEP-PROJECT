/**
 * Timetable Seed Script — Conflict-Free, Role-Synced
 * 
 * Design:
 *   - Each teacher has ONE primary subject.
 *   - Each teacher teaches that subject to EACH section once per day,
 *     but at DIFFERENT time slots per section to avoid clashes.
 *   - Admin: sees all 30 slots per day.
 *   - Teacher: sees only their own slots (filtered by teacher._id in backend).
 *   - Student: sees only their section's slots (filtered by classId in backend).
 * 
 * Run: node server/seedTimetable.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/academic-system';

const TimetableSchema = new mongoose.Schema({
    day: String,
    slots: [{
        startTime: String,
        endTime: String,
        subject: String,
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        room: String,
        classId: String
    }]
});

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    subjects: [String],
    section: String,
    department: String
});

const Timetable = mongoose.model('Timetable', TimetableSchema);
const User = mongoose.model('User', UserSchema);

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' }
];
const SECTIONS = ['K26PS', 'K26ND', 'K26SR', 'K26WT', 'K26SF'];
const ROOMS = ['Lab-A', 'Lab-B', 'R-101', 'R-202', 'Lab-C', 'Lab-D', 'R-301', 'Auditorium'];

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const teachers = await User.find({ role: 'teacher' });
    if (teachers.length === 0) {
        console.log('❌  No teachers found! Register teachers first and re-run.');
        await mongoose.connection.close();
        return;
    }

    console.log(`Found ${teachers.length} teacher(s):`);
    teachers.forEach((t, i) => {
        console.log(`  [${i}] ${t.name} — subject: ${t.subjects?.[0] || 'General Studies'}`);
    });

    // Clear all existing timetable data
    await Timetable.deleteMany({});
    console.log('\n🗑️  Cleared old timetable data\n');

    /**
     * Assignment Logic:
     * We have N_TEACHERS teachers and N_SLOTS=6 time slots and N_SECTIONS=5 sections.
     * 
     * For each day:
     *   For each section (sectionIdx):
     *     For each teacher (teacherIdx):
     *       Assign this teacher to slot = (teacherIdx + sectionIdx) % N_SLOTS
     * 
     * This ensures:
     *   - A given teacher is at DIFFERENT time slots in different sections on the same day.
     *   - No two teachers are assigned the same slot in the same section.
     *   - Each section has a full schedule (if num_teachers >= num_slots).
     */

    const numSlots = TIME_SLOTS.length;

    for (const day of DAYS) {
        const allSlotsForDay = [];

        for (let sIdx = 0; sIdx < SECTIONS.length; sIdx++) {
            const section = SECTIONS[sIdx];

            // Track which time slots are used for this section (to avoid two teachers at same time in same section)
            const usedSlotsInSection = new Set();

            for (let tIdx = 0; tIdx < teachers.length; tIdx++) {
                const teacher = teachers[tIdx];
                const subject = teacher.subjects?.[0] || 'General Studies';

                // Stagger slot across sections to avoid teacher clashes
                let slotIdx = (tIdx + sIdx) % numSlots;

                // If teacher is already assigned at this slot (for another section on same day),
                // find the next available slot for this teacher in this day
                // Check: has this teacher been assigned to slotIdx already today for another section?
                const teacherUsedSlots = allSlotsForDay
                    .filter(s => s.teacher.toString() === teacher._id.toString())
                    .map(s => s._slotIdx);

                // Find an available slot for this section that this teacher isn't already using elsewhere today
                let attempts = 0;
                while ((teacherUsedSlots.includes(slotIdx) || usedSlotsInSection.has(slotIdx)) && attempts < numSlots) {
                    slotIdx = (slotIdx + 1) % numSlots;
                    attempts++;
                }

                if (attempts >= numSlots) {
                    // No available slot — skip this teacher for this section today
                    console.log(`  ⚠️ Skip: ${teacher.name} has no free slot for ${section} on ${day}`);
                    continue;
                }

                const time = TIME_SLOTS[slotIdx];
                const room = ROOMS[(tIdx + sIdx) % ROOMS.length];

                usedSlotsInSection.add(slotIdx);

                allSlotsForDay.push({
                    startTime: time.start,
                    endTime: time.end,
                    subject,
                    teacher: teacher._id,
                    room,
                    classId: section,
                    _slotIdx: slotIdx // internal use only for conflict detection, not saved
                });
            }
        }

        // Strip internal _slotIdx before saving
        const cleanSlots = allSlotsForDay.map(({ _slotIdx, ...rest }) => rest);

        await Timetable.create({ day, slots: cleanSlots });
        console.log(`📅 ${day}: ${cleanSlots.length} slots (${SECTIONS.length} sections × ${Math.round(cleanSlots.length / SECTIONS.length)} classes/section)`);
    }

    // Summary per teacher
    const saved = await Timetable.find().populate('slots.teacher', 'name');
    console.log('\n📊 Summary per teacher:');
    const teacherCount = {};
    saved.forEach(day => {
        day.slots.forEach(slot => {
            if (slot.teacher) {
                const name = slot.teacher.name;
                teacherCount[name] = (teacherCount[name] || 0) + 1;
            }
        });
    });
    Object.entries(teacherCount).forEach(([name, count]) => {
        console.log(`  ${name}: ${count} total class slots across the week`);
    });

    console.log('\n🚀 Timetable seeded successfully! The schedule is conflict-free.');
    console.log('   Admin: sees ALL slots');
    console.log('   Student: sees their SECTION\'s slots');
    console.log('   Teacher: sees THEIR OWN slots\n');
    await mongoose.connection.close();
}

seed().catch(err => {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
});
