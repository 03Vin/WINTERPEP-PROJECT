import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from 'recharts';
import {
    Book,
    Award,
    Clock,
    TrendingUp,
    Sparkles,
    RotateCcw,
    BookOpen,
    QrCode
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import CurriculumSummary from '../components/CurriculumSummary';
import QRScanner from '../components/QRScanner';

const COLORS = ['#3b82f6', '#1e293b'];

const StudentDashboard = () => {
    const { user } = useAuth();
    const [attendanceStats, setAttendanceStats] = useState({});
    const [overallStats, setOverallStats] = useState({ present: 0, total: 100, percentage: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const curriculumSubjects = [
        {
            id: 1,
            name: 'INT656 : ADVANCED WEB DEVELOPENT',
            forecast: 'Apr 12',
            topics: [
                { id: 101, title: 'Server-Side Rendering (SSR)', completed: true },
                { id: 102, title: 'State Management with Redux', completed: true },
                { id: 103, title: 'Web Sockets & Real-time Data', completed: false },
                { id: 104, title: 'Performance Optimization', completed: false },
            ]
        },
        {
            id: 2,
            name: 'INT545 : WEB APP DEVELOPMENT WITH REACTJS',
            forecast: 'Mar 28',
            topics: [
                { id: 201, title: 'React Hooks (Custom & Built-in)', completed: true },
                { id: 202, title: 'Context API for Auth', completed: true },
                { id: 203, title: 'React Router v7 Integration', completed: true },
                { id: 204, title: 'Optimistic UI Updates', completed: false },
            ]
        },
        {
            id: 3,
            name: 'PEA333 : ANALYTICAL SKILLS',
            forecast: 'Apr 05',
            topics: [
                { id: 301, title: 'Quantitative Aptitude - Algebra', completed: true },
                { id: 302, title: 'Logical Reasoning - Puzzles', completed: true },
                { id: 303, title: 'Data Interpretation', completed: false },
            ]
        },
        {
            id: 4,
            name: 'MTH290 : PROBABILITY AND STATISTICS',
            forecast: 'Apr 20',
            topics: [
                { id: 401, title: 'Descriptive Statistics', completed: true },
                { id: 402, title: 'Probability Distributions', completed: false },
                { id: 403, title: 'Hypothesis Testing', completed: false },
            ]
        },
        {
            id: 5,
            name: 'CSE202 : PROGRAMMING IN C++',
            forecast: 'Mar 15',
            topics: [
                { id: 501, title: 'Classes & Objects', completed: true },
                { id: 502, title: 'Inheritance & Polymorphism', completed: true },
                { id: 503, title: 'STL – Standard Template Library', completed: false },
            ]
        },
        {
            id: 6,
            name: 'CSE205 : DATA STUCTURES AND ALGORITHMS',
            forecast: 'Apr 30',
            topics: [
                { id: 601, title: 'Complexity Analysis', completed: true },
                { id: 602, title: 'Linked Lists & Stacks', completed: true },
                { id: 603, title: 'Trees & Graphs Algorithms', completed: false },
                { id: 604, title: 'Dynamic Programming', completed: false },
            ]
        },
        {
            id: 7,
            name: 'CSE306 : COMPUTER NETWORKS',
            forecast: 'Apr 18',
            topics: [
                { id: 701, title: 'OSI & TCP/IP Reference Models', completed: true },
                { id: 702, title: 'IP Addressing & Subnetting', completed: true },
                { id: 703, title: 'Routing & Switching', completed: false },
                { id: 704, title: 'Network Security Fundamentals', completed: false },
            ]
        },
        {
            id: 8,
            name: 'PEL136 : COMMUNICATION SKILLS',
            forecast: 'Mar 10',
            topics: [
                { id: 801, title: 'Verbal & Non-Verbal Communication', completed: true },
                { id: 802, title: 'Professional Writing Skills', completed: true },
                { id: 803, title: 'Presentation & Public Speaking', completed: true },
            ]
        }
    ];

    useEffect(() => {
        fetchAttendance();
    }, [user]);

    const fetchAttendance = async () => {
        setIsLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            if (!token) return;

            const res = await axios.get('http://localhost:5000/api/attendance/my-attendance', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { stats } = res.data;
            setAttendanceStats(stats);

            // Calculate overall percentage
            let totalPres = 0;
            let totalSess = 0;
            Object.values(stats).forEach(s => {
                totalPres += s.present;
                totalSess += s.total;
            });

            const overallPct = totalSess > 0 ? (totalPres / totalSess) * 100 : 0;
            setOverallStats({
                present: totalPres,
                total: totalSess || 1,
                percentage: overallPct,
                projectedPercentage: Math.min(100, overallPct + 5) // Simple aggregate projection
            });

        } catch (err) {
            console.error("Attendance Fetch Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkPresence = async (token, sessionId = null) => {
        try {
            const userToken = JSON.parse(localStorage.getItem('user'))?.token;
            const fingerprint = btoa(navigator.userAgent + navigator.language + screen.width).substring(0, 16);

            const submitRes = await axios.post('http://localhost:5000/api/attendance/session/verify', {
                token: token,
                sessionId: sessionId,
                metadata: {
                    deviceFingerprint: fingerprint,
                    ipAddress: 'Captured by Server'
                }
            }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            if (submitRes.data.success) {
                alert("✅ Presence Verified! Attendance marked.");
                fetchAttendance();
                if (document.getElementById('qr-token-input')) {
                    document.getElementById('qr-token-input').value = '';
                }
            }
        } catch (err) {
            alert("❌ Check-in Failed: " + (err.response?.data?.message || err.message));
        }
    };

    const handleViewNotes = () => {
        alert("Accessing your personal academic notes...\n\n- Advanced Maths (Unit 2 Summary)\n- DB Systems (SQL Cheatsheet)\n- Physics II (Lecture 4 Video)");
    };

    const attendanceData = [
        { name: 'Attended', value: overallStats.present },
        { name: 'Absent', value: Math.max(0, overallStats.total - overallStats.present) },
    ];

    if (!user) return <div className="p-24 text-center text-white neon-text font-black uppercase tracking-[0.5em] animate-pulse">Initializing Neural Link...</div>;

    return (
        <div className="space-y-12 relative pb-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-neon animate-pulse shadow-[0_0_15px_#a855f7]" />
                        <h1 className="text-4xl font-black neon-text uppercase tracking-tighter">Neural Hub</h1>
                    </div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Designation: <span className="text-neon">{user?.name}</span> | Cognitive Status: <span className="text-white/60">ACTIVE</span></p>
                </div>
                <div className="flex gap-4 w-full lg:w-auto">
                    <button
                        onClick={fetchAttendance}
                        className="glass-card p-4 hover:bg-neon/10 transition-all text-white/40 hover:text-neon border border-white/5 hover:border-neon/30 rounded-2xl group"
                    >
                        <RotateCcw className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-700 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={handleViewNotes}
                        className="neon-button flex-1 lg:flex-none flex items-center justify-center gap-3 px-8"
                    >
                        <Book className="w-4 h-4" />
                        <span className="font-black">Access Datasheets</span>
                    </button>
                </div>
            </div>

            {/* Live QR Check-in Portal - Extraordinary Edition */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="grid grid-cols-1 gap-6"
                >
                    <GlassCard className="p-12 border-neon/40 border-2 bg-gradient-to-br from-neon/10 to-transparent relative overflow-hidden group shadow-[0_0_80px_rgba(168,85,247,0.1)]">
                        {/* Security Accents */}
                        <div className="absolute top-0 left-0 w-16 h-1 bg-neon/50 shadow-[0_0_15px_#a855f7]" />
                        <div className="absolute top-0 left-0 w-1 h-16 bg-neon/50 shadow-[0_0_15px_#a855f7]" />

                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                            <QrCode className="w-64 h-64 text-neon" />
                        </div>

                        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                            <div className="space-y-6 text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-4">
                                    <div className="relative">
                                        <div className="w-4 h-4 rounded-full bg-neon animate-ping absolute inset-0" />
                                        <div className="w-4 h-4 rounded-full bg-neon relative z-10 border-2 border-slate-950" />
                                    </div>
                                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Session Sync</h2>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-neon/80 text-xs font-black uppercase tracking-[0.4em]">Classroom Uplink Established</p>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] max-w-sm leading-relaxed">
                                        Synchronize your temporal coordinates using the optical interface or manual signature override.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center w-full lg:w-auto gap-6">
                                <div className="relative w-full sm:w-80">
                                    <input
                                        id="qr-token-input"
                                        type="text"
                                        placeholder="SYNC-TOKEN"
                                        maxLength={8}
                                        className="bg-slate-950/40 border-2 border-white/10 rounded-[1.5rem] px-10 py-6 text-white font-mono text-center tracking-[0.5em] text-2xl font-black focus:outline-none focus:border-neon focus:bg-neon/5 transition-all w-full shadow-inner uppercase"
                                    />
                                    <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
                                        <Clock className="w-5 h-5 text-neon" />
                                    </div>
                                </div>
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <button
                                        onClick={() => setIsScannerOpen(true)}
                                        className="bg-neon text-slate-950 p-6 rounded-[1.5rem] hover:shadow-[0_0_40px_#a855f7] transition-all active:scale-90 flex items-center justify-center flex-1 sm:flex-none group/scan"
                                        title="Initialize Optical Link"
                                    >
                                        <QrCode className="w-8 h-8 group-hover/scan:rotate-12 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => handleMarkPresence(document.getElementById('qr-token-input').value)}
                                        className="neon-button px-12 py-6 whitespace-nowrap text-sm font-black tracking-[0.3em] flex-1 sm:flex-none uppercase"
                                    >
                                        Transmit Signature
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Status Bar */}
                        <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center lg:justify-start gap-10">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Quantum Encryption</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-neon animate-pulse shadow-[0_0_10px_#a855f7]" />
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Live Biometrics Active</span>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </AnimatePresence>

            {/* QR Scanner Modal */}
            <AnimatePresence>
                {isScannerOpen && (
                    <QRScanner
                        onScanSuccess={(token, sessionId) => {
                            handleMarkPresence(token, sessionId);
                            setIsScannerOpen(false);
                        }}
                        onScanError={(err) => console.log("Scanner Logic Error:", err)}
                        onClose={() => setIsScannerOpen(false)}
                    />
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Cognitive Engagement Chart */}
                <GlassCard className="flex flex-col items-center justify-center p-10 relative overflow-hidden h-full min-h-[400px] border-white/5 bg-white/[0.01]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon via-accent to-purple-500"></div>
                    <div className="mb-8 text-center">
                        <h3 className="text-[10px] text-white/40 uppercase font-black tracking-[0.4em] mb-2">Neural Engagement</h3>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-ping" />
                            <span className="text-xs font-black text-neon uppercase tracking-widest">Live Diagnostic</span>
                        </div>
                    </div>

                    <div className="h-64 w-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={attendanceData}
                                    innerRadius={75}
                                    outerRadius={100}
                                    paddingAngle={10}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {attendanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="transition-all hover:opacity-80" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '2px solid #a855f740', borderRadius: '16px', fontSize: '10px', color: '#fff', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                            <span className="text-5xl font-black text-white tracking-tighter shadow-neon/20 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                                {Math.round(overallStats.percentage)}%
                            </span>
                            <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.3em] mt-1">Aggregate</span>
                        </div>
                    </div>
                </GlassCard>

                {/* Curriculum Matrix Column */}
                <CurriculumSummary subjects={curriculumSubjects} className="lg:row-span-2" />

                {/* Sector Node Performance */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-black flex items-center gap-3 text-white uppercase tracking-tighter">
                            <Award className="w-8 h-8 text-neon" />
                            Sector Performance
                        </h2>
                        <div className="flex items-center gap-2 ml-1">
                            <div className="w-2 h-2 rounded-full bg-neon/40" />
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">{Object.keys(attendanceStats).length} Computational Clusters Active</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        <AnimatePresence mode="popLayout">
                            {Object.entries(attendanceStats).map(([subject, s], idx) => (
                                <motion.div
                                    key={subject}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <GlassCard className={`p-6 border-2 border-white/5 relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] ${s.percentage >= 75 ? 'hover:border-neon/30' : 'hover:border-red-500/30'}`}>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-black text-white/90 uppercase tracking-widest line-clamp-1 leading-relaxed">{subject}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] text-neon font-black bg-neon/10 px-2 py-0.5 rounded-full border border-neon/20 uppercase">Node {idx + 1}</span>
                                                    <span className="text-[10px] text-white/30 font-mono tracking-tighter">{s.present} / {s.total} PULSES</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-2xl font-black ${s.percentage >= 75 ? 'text-neon' : 'text-red-400'} drop-shadow-[0_0_5px_currentColor]`}>
                                                    {Math.round(s.percentage)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-slate-950/60 rounded-full overflow-hidden border border-white/5 relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${s.percentage}%` }}
                                                className={`h-full relative ${s.percentage >= 75 ? 'bg-neon-gradient shadow-[0_0_10px_#a855f7]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`}
                                            >
                                                <div className="absolute top-0 right-0 h-full w-2 bg-white/40 blur-[2px]" />
                                            </motion.div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Predictive Intelligence Terminal */}
            <GlassCard className="p-12 border-neon/30 border-2 bg-gradient-to-br from-neon/5 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <TrendingUp className="w-48 h-48 text-neon" />
                </div>

                {/* Holographic Accents */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-neon/10 rounded-full blur-[80px] group-hover:bg-neon/20 transition-all" />

                <div className="relative z-10 space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-neon/10 border-2 border-neon/20 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-transform group-hover:scale-110">
                            <Sparkles className="w-8 h-8 text-neon" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Predictive Intelligence</h2>
                            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] mt-1">Deep Learning Engagement Model <span className="text-neon">v4.0.2</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <p className="text-lg text-white/70 leading-relaxed font-medium">
                                Analyzing current engagement flux @ <span className="text-neon font-black">{Math.round(overallStats.percentage)}%</span>. Neural systems indicate a <span className="text-accent font-black tracking-widest uppercase">Stable Trajectory</span>.
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Projected Yield</p>
                                    <p className="text-2xl font-black text-neon">{Math.round(overallStats.projectedPercentage)}%</p>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div className="space-y-1">
                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Confidence Rating</p>
                                    <p className="text-2xl font-black text-accent uppercase">High</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-slate-950/60 border-2 border-accent/20 relative overflow-hidden group/alert">
                            <div className="absolute top-0 right-0 w-2 h-2 bg-accent animate-ping m-6" />
                            <h4 className="font-black text-[11px] text-accent mb-4 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Critical Temporal Node
                            </h4>
                            <p className="text-base font-black text-white/90 leading-tight">
                                Advanced Web Development — Sector K26ND
                            </p>
                            <p className="text-[10px] text-white/30 mt-3 font-bold uppercase tracking-widest leading-relaxed">
                                Recommendation: Maintain presence protocol to sustain technical aptitude above 85th percentile.
                            </p>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default StudentDashboard;
