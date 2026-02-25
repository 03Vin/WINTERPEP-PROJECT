import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { BookOpen, Users, Clock, CheckCircle, TrendingUp, Sparkles, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SECTIONS = ['K26PS', 'K26ND', 'K26SR', 'K26WT', 'K26SF'];

const TeacherDashboard = () => {
    const { user } = useAuth();
    const [syllabusCovered, setSyllabusCovered] = useState(68);
    const [recentLogs, setRecentLogs] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);

    const activeDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
    const primarySubject = user?.subjects?.[0] || 'Unassigned Subject';

    useEffect(() => {
        const savedLogs = localStorage.getItem(`teacher_logs_${user?.email}`);
        if (savedLogs) setRecentLogs(JSON.parse(savedLogs));
        fetchTeacherSchedule();
    }, [user]);

    const fetchTeacherSchedule = async () => {
        setIsLoadingSchedule(true);
        try {
            const res = await axios.get('/api/timetable');
            setScheduleData(res.data);
        } catch (err) {
            console.error("Schedule Fetch Error:", err);
        } finally {
            setIsLoadingSchedule(false);
        }
    };

    const myClasses = scheduleData.flatMap(day =>
        (day.slots || []).map(slot => ({ ...slot, day: day.day }))
    );

    const todayClasses = myClasses.filter(cls => cls.day === activeDay);

    const toggleLogStatus = (id) => {
        const updated = recentLogs.map(log => {
            if (log.id !== id) return log;
            const nextStatus = log.status === 'Logged' ? 'Completed' : 'Logged';
            return { ...log, status: nextStatus };
        });
        setRecentLogs(updated);
        localStorage.setItem(`teacher_logs_${user?.email}`, JSON.stringify(updated));
    };


    const [feedbackInput, setFeedbackInput] = useState({ name: '', grade: '', goal: '' });
    const [generatedFeedback, setGeneratedFeedback] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateFeedback = () => {
        if (!feedbackInput.name || !feedbackInput.grade) {
            alert("Please provide at least a student name and grade.");
            return;
        }
        setIsGenerating(true);
        setTimeout(() => {
            const drafts = [
                `Dear ${feedbackInput.name}, excellent work on reaching ${feedbackInput.grade}% in ${primarySubject}! Your dedication is evident.`,
                `Hi ${feedbackInput.name}, you've secured a solid ${feedbackInput.grade}% in ${primarySubject}. To improve, focus on ${feedbackInput.goal || 'practical demonstrations'}.`,
                `Great job ${feedbackInput.name}! Scoring ${feedbackInput.grade}% is high achievement in ${primarySubject.split(':')[0]}.`
            ];
            setGeneratedFeedback(drafts[Math.floor(Math.random() * drafts.length)]);
            setIsGenerating(false);
        }, 1500);
    };

    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [selectedSectionForAttendance, setSelectedSectionForAttendance] = useState(null);
    const [roster, setRoster] = useState([]);
    const [attendanceStates, setAttendanceStates] = useState({}); // { studentId: 'present' | 'absent' }
    const [isLoadingRoster, setIsLoadingRoster] = useState(false);

    const handleLogLecture = async (section) => {
        setSelectedSectionForAttendance(section);
        setShowAttendanceModal(true);
        setIsLoadingRoster(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/attendance/roster/${section}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRoster(res.data);
            const initialStates = {};
            res.data.forEach(s => { initialStates[s._id] = 'present'; });
            setAttendanceStates(initialStates);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch section roster.");
        } finally {
            setIsLoadingRoster(false);
        }
    };

    const submitAttendance = async () => {
        try {
            const attendanceDelta = Object.keys(attendanceStates).map(id => ({
                id,
                status: attendanceStates[id]
            }));

            await axios.post('http://localhost:5000/api/attendance/bulk-mark', {
                students: attendanceDelta,
                section: selectedSectionForAttendance,
                subject: primarySubject
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Log the lecture locally as well for the history view
            setSyllabusCovered(prev => Math.min(prev + 2, 100));
            const newLog = {
                id: Date.now(),
                subject: primarySubject,
                section: selectedSectionForAttendance,
                time: 'Just now',
                status: 'Logged'
            };
            setRecentLogs(prev => [newLog, ...prev]);
            localStorage.setItem(`teacher_logs_${user?.email}`, JSON.stringify([newLog, ...recentLogs]));

            alert(`✅ Attendance for ${selectedSectionForAttendance} submitted successfully!`);
            setShowAttendanceModal(false);
        } catch (err) {
            alert("Error submitting attendance: " + err.message);
        }
    };

    return (
        <div className="space-y-12 relative">
            <AnimatePresence>
                {showAttendanceModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-slate-900 border-2 border-neon/40 rounded-[2.5rem] w-full max-w-2xl p-10 shadow-[0_0_80px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col max-h-[90vh] relative"
                        >
                            {/* Modal Accents */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon/50 to-transparent" />

                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Attendance Protocol</h2>
                                    </div>
                                    <p className="text-neon/60 text-[10px] uppercase font-black tracking-[0.3em]">Sector: {selectedSectionForAttendance} | Registry: {primarySubject}</p>
                                </div>
                                <button onClick={() => setShowAttendanceModal(false)} className="p-3 hover:bg-white/5 rounded-2xl border border-white/5 transition-all text-white/40 hover:text-white">
                                    <Clock className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto pr-4 custom-scrollbar space-y-4 mb-10">
                                {isLoadingRoster ? (
                                    <div className="py-24 text-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-12 h-12 border-4 border-neon/20 border-t-neon rounded-full mx-auto mb-4"
                                        />
                                        <span className="text-neon font-black tracking-widest uppercase text-xs">Accessing Student Database...</span>
                                    </div>
                                ) : roster.length > 0 ? roster.map(student => (
                                    <div key={student._id} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border-2 border-white/5 group hover:border-neon/20 hover:bg-neon/5 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-black text-sm group-hover:bg-neon-gradient group-hover:text-white transition-all">
                                                {student.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-white tracking-tight">{student.name}</p>
                                                <p className="text-[10px] text-white/30 font-mono uppercase">{student.rollNumber || student.studentId}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setAttendanceStates({ ...attendanceStates, [student._id]: 'present' })}
                                                className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all border-2 ${attendanceStates[student._id] === 'present' ? 'bg-green-500 border-green-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'}`}
                                            >
                                                PRESENT
                                            </button>
                                            <button
                                                onClick={() => setAttendanceStates({ ...attendanceStates, [student._id]: 'absent' })}
                                                className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all border-2 ${attendanceStates[student._id] === 'absent' ? 'bg-red-500 border-red-400 text-black shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'}`}
                                            >
                                                ABSENT
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                        <Users className="w-10 h-10 text-white/10 mx-auto mb-4" />
                                        <p className="text-xs text-white/20 uppercase font-black">Zero Student Signatures Found</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-6">
                                <button onClick={() => setShowAttendanceModal(false)} className="flex-1 py-5 rounded-[1.5rem] border-2 border-white/5 text-white/40 font-black uppercase text-xs hover:bg-white/5 hover:text-white transition-all">Aabort Protocol</button>
                                <button onClick={submitAttendance} className="flex-[2.5] py-5 rounded-[1.5rem] bg-neon text-slate-950 font-black uppercase text-xs shadow-[0_0_30px_#a855f7]/30 hover:scale-[1.02] transition-all">Commit Registry</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-neon animate-pulse shadow-[0_0_15px_#a855f7]" />
                        <h1 className="text-4xl font-black neon-text uppercase tracking-tighter">Faculty Portal</h1>
                    </div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Instructor: <span className="text-neon">{user?.name}</span> | Command Module: <span className="text-white/60">{primarySubject}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassCard className="flex flex-col gap-3 border-neon/30 border-2 bg-gradient-to-br from-neon/5 to-transparent relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Users className="w-12 h-12 text-neon" />
                    </div>
                    <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-black">Managed Roster</span>
                    <span className="text-4xl font-black text-white">{myClasses.length * 40 || 0}</span>
                    <div className="text-[10px] text-neon flex items-center gap-2 mt-2 font-black bg-neon/10 px-3 py-1 rounded-full w-fit">
                        <Users className="w-3 h-3" /> {new Set(myClasses.map(c => c.section)).size} SECTIONS
                    </div>
                </GlassCard>

                <GlassCard className="flex flex-col gap-3 border-accent/30 border-2 bg-gradient-to-br from-accent/5 to-transparent relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-12 h-12 text-accent" />
                    </div>
                    <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-black">Syllabus Matrix</span>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-accent">{syllabusCovered}%</span>
                        <span className="text-[10px] text-white/40 mb-2 font-bold uppercase">Target: 100%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden border border-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${syllabusCovered}%` }}
                            className="bg-accent-gradient h-full relative"
                        >
                            <div className="absolute top-0 right-0 h-full w-2 bg-white/50 blur-[2px]" />
                        </motion.div>
                    </div>
                </GlassCard>

                <GlassCard className="flex flex-col gap-3 border-green-500/30 border-2 bg-gradient-to-br from-green-500/5 to-transparent relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Clock className="w-12 h-12 text-green-500" />
                    </div>
                    <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-black">Active Phase</span>
                    <span className="text-xl font-black text-green-500 uppercase truncate leading-none mt-2">
                        {myClasses.length > 0 ? `${myClasses[0].section} - LIVE` : 'STANDBY'}
                    </span>
                    <div className="text-[10px] text-green-500/60 font-black uppercase flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                        Next Slot Available
                    </div>
                </GlassCard>

                <GlassCard className="flex flex-col gap-3 border-purple-500/30 border-2 bg-gradient-to-br from-purple-500/5 to-transparent relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Calendar className="w-12 h-12 text-purple-500" />
                    </div>
                    <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-black">Resource Weight</span>
                    <span className="text-4xl font-black text-purple-500">{myClasses.length}</span>
                    <div className="text-[10px] text-purple-500 flex items-center gap-2 mt-2 font-black bg-purple-500/10 px-3 py-1 rounded-full w-fit">
                        LECTURES / WK
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Today's Temporal Matrix - RE-ADDED & IMPROVED */}
                    <GlassCard className="flex flex-col gap-8 border-neon/30 border-2 bg-gradient-to-br from-neon/5 to-transparent relative overflow-hidden group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-neon/10 rounded-2xl">
                                    <Clock className="w-8 h-8 text-neon" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Today's Schedule</h3>
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                                        Active Phase: <span className="text-neon">{activeDay}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-neon animate-ping" />
                                <span className="text-[10px] text-neon font-black uppercase tracking-widest">Live Sync</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {isLoadingSchedule ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="h-40 rounded-[2rem] bg-white/5 animate-pulse border-2 border-white/5" />
                                ))
                            ) : todayClasses.length > 0 ? todayClasses.map((cls, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="p-6 rounded-[2rem] border-2 border-neon/20 bg-slate-950/40 relative overflow-hidden group/item"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/item:scale-110 transition-transform">
                                        <Sparkles className="w-12 h-12 text-neon" />
                                    </div>
                                    <p className="text-[10px] font-black text-neon uppercase tracking-widest mb-2">{cls.startTime} - {cls.endTime}</p>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4 leading-tight">{cls.subject}</h4>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                                <Users className="w-3 h-3 text-white/40" />
                                            </div>
                                            <span className="text-[10px] font-bold text-white/60">{cls.classId}</span>
                                        </div>
                                        <button
                                            onClick={() => handleLogLecture(cls.classId)}
                                            className="p-2 rounded-xl bg-neon/10 text-neon hover:bg-neon hover:text-slate-950 transition-all"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                                    <Calendar className="w-8 h-8 text-white/5 mx-auto mb-4" />
                                    <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em]">No Temporal Engagements Today</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Master Record - Full Lecture Schedule */}
                    <GlassCard className="flex flex-col gap-8 border-white/5 relative bg-white/[0.01]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl">
                                    <Calendar className="w-8 h-8 text-white/40" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Lecture Registry</h3>
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Full Weekly Matrix</p>
                                </div>
                            </div>
                            <NavLink to="/timetable" className="text-[10px] font-black text-neon hover:underline tracking-widest">VIEW FULL GRID</NavLink>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-y-4">
                                <thead>
                                    <tr className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-black px-6">
                                        <th className="px-6 pb-2">Temporal Node</th>
                                        <th className="px-6 pb-2">Sector</th>
                                        <th className="px-6 pb-2">Module Designation</th>
                                        <th className="px-6 pb-2 text-right">System Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoadingSchedule ? (
                                        <tr><td colSpan="4" className="py-20 text-center text-white/10 animate-pulse">SYNCHRONIZING...</td></tr>
                                    ) : myClasses.length > 0 ? myClasses.sort((a, b) => {
                                        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                                        return days.indexOf(a.day) - days.indexOf(b.day);
                                    }).map((cls, idx) => (
                                        <tr key={idx} className="group transition-all">
                                            <td className="px-6 py-5 rounded-l-[1.5rem] bg-white/[0.03] group-hover:bg-neon/5 border-y-2 border-l-2 border-white/5 group-hover:border-neon/20 transition-all">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-neon tracking-[0.2em]">{cls.day}</span>
                                                    <span className="text-[8px] text-white/30 font-mono">{cls.startTime}-{cls.endTime}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 bg-white/[0.03] group-hover:bg-neon/5 border-y-2 border-white/5 group-hover:border-neon/20 transition-all text-xs font-black text-white/60">
                                                {cls.classId}
                                            </td>
                                            <td className="px-6 py-5 bg-white/[0.03] group-hover:bg-neon/5 border-y-2 border-white/5 group-hover:border-neon/20 transition-all text-[10px] font-bold text-white/40 uppercase">
                                                {cls.subject}
                                            </td>
                                            <td className="px-6 py-5 rounded-r-[1.5rem] bg-white/[0.03] group-hover:bg-neon/5 border-y-2 border-r-2 border-white/5 group-hover:border-neon/20 text-right transition-all">
                                                <button
                                                    onClick={() => handleLogLecture(cls.classId)}
                                                    className="bg-neon/10 text-neon border-2 border-neon/30 text-[9px] font-black uppercase px-4 py-2 rounded-xl hover:bg-neon hover:text-slate-950 transition-all"
                                                >
                                                    Mark Presence
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="py-12 text-center text-white/10">No records found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>

                    {/* AI Logic Terminal */}
                    <GlassCard className="flex flex-col gap-8 border-accent/20 bg-accent/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Sparkles className="w-32 h-32 text-accent" />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-accent/10 rounded-2xl">
                                <Sparkles className="w-8 h-8 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">AI Logic Assistant</h3>
                                <p className="text-[10px] text-accent/60 font-black uppercase tracking-widest mt-1">Smart Feedback Generator</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[8px] font-black text-accent uppercase tracking-widest ml-2">Entity Name</label>
                                <input
                                    type="text"
                                    placeholder="DESIGNATE STUDENT"
                                    value={feedbackInput.name}
                                    onChange={(e) => setFeedbackInput({ ...feedbackInput, name: e.target.value })}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-sm font-black outline-none focus:border-accent/50 text-white placeholder:text-white/10 uppercase tracking-tighter"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] font-black text-accent uppercase tracking-widest ml-2">Performance Yield</label>
                                <input
                                    type="number"
                                    placeholder="GRADE %"
                                    value={feedbackInput.grade}
                                    onChange={(e) => setFeedbackInput({ ...feedbackInput, grade: e.target.value })}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-sm font-black outline-none focus:border-accent/50 text-white placeholder:text-white/10 uppercase tracking-tighter"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={generateFeedback}
                                    disabled={isGenerating}
                                    className="w-full py-4 rounded-2xl bg-accent text-slate-950 font-black uppercase text-xs shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.05] transition-all disabled:opacity-50"
                                >
                                    {isGenerating ? 'PROCESSING...' : 'INITIATE AI DRAFT'}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {generatedFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-8 rounded-[2rem] bg-slate-950/40 border-2 border-accent/20 relative group/terminal"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                                        <span className="text-[8px] font-black text-accent uppercase tracking-widest">Output Decrypted</span>
                                    </div>
                                    <p className="text-base text-white/70 leading-relaxed italic font-medium font-mono">"{generatedFeedback}"</p>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedFeedback);
                                            alert("Draft copied to clipboard!");
                                        }}
                                        className="absolute top-6 right-6 p-2 bg-white/5 rounded-xl border border-white/10 text-accent opacity-0 group-hover/terminal:opacity-100 transition-all hover:bg-accent hover:text-slate-950"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </GlassCard>
                </div>

                <div className="space-y-10">
                    <GlassCard className="flex flex-col gap-8">
                        <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-neon" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">System Logs</h3>
                        </div>
                        <div className="space-y-4">
                            {recentLogs.length > 0 ? recentLogs.map(log => (
                                <div key={log.id} className="flex justify-between items-center p-5 rounded-[1.5rem] bg-white/[0.02] border-2 border-white/5 hover:border-neon/20 transition-all group">
                                    <div>
                                        <p className="text-xs font-black text-white/90 uppercase tracking-tighter">{log.section} : {log.subject?.split(':')?.[0]}</p>
                                        <p className="text-[9px] text-white/30 font-mono mt-1">{log.time}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleLogStatus(log.id)}
                                        className={`text-[8px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest transition-all ${log.status === 'Completed' ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-neon/10 text-neon border border-neon/30 hover:bg-neon hover:text-slate-950'
                                            }`}
                                    >
                                        {log.status}
                                    </button>
                                </div>
                            )) : (
                                <div className="py-12 text-center opacity-20">
                                    <Clock className="w-8 h-8 mx-auto mb-2" />
                                    <p className="text-[10px] uppercase font-black tracking-widest">No Temporal Data</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    <GlassCard className="bg-gradient-to-br from-accent/20 to-transparent border-accent/30 border-2 relative overflow-hidden group">
                        <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-24 h-24 text-accent" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-accent/20 rounded-lg">
                                <Sparkles className="w-4 h-4 text-accent" />
                            </div>
                            <h3 className="font-black text-white uppercase tracking-tighter">Predictive Insight</h3>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed font-medium">
                            Operational efficiency is <span className="text-accent font-black underline decoration-accent/30 decoration-2 italic">Optimized (+4.2%)</span>. System recommends deeper focus on <span className="text-white font-black">Week 12 Core Logic</span> based on current performance yields.
                        </p>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
