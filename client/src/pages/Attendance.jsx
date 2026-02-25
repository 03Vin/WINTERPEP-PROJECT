import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import {
    Users,
    Calendar,
    Clock,
    BookOpen,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    ChevronDown,
    Save,
    RotateCcw,
    AlertCircle,
    Sparkles,
    ShieldAlert,
    TrendingDown,
    Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, StopCircle } from 'lucide-react';

const Attendance = () => {
    const { user } = useAuth();
    const [sections] = useState(['K26PS', 'K26ND', 'K26SR', 'K26WT', 'K26SF']);
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

    const [roster, setRoster] = useState([]);
    const [attendanceStates, setAttendanceStates] = useState({}); // { studentId: 'present' | 'absent' | 'late' }
    const [riskAssessments, setRiskAssessments] = useState({}); // { studentId: { riskScore, status, reason } }
    const [fraudAlerts, setFraudAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Dynamic QR Session State
    const [activeSession, setActiveSession] = useState(null);
    const [qrToken, setQrToken] = useState('');
    const [sessionTimer, setSessionTimer] = useState(0);
    const [tokenTimer, setTokenTimer] = useState(10);

    const timeSlots = [
        '09:00 - 10:00',
        '10:00 - 11:00',
        '11:00 - 12:00',
        '12:00 - 13:00',
        '14:00 - 15:00',
        '15:00 - 16:00'
    ];

    const subjects = user?.subjects || ['Full Stack Web Dev', 'Artificial Intelligence', 'Data Structures', 'Network Security'];

    useEffect(() => {
        if (selectedSection) {
            fetchRoster();
            fetchBehavioralData();
        }
    }, [selectedSection]);

    const fetchBehavioralData = async () => {
        try {
            const token = user?.token;
            const res = await axios.get(`http://localhost:5000/api/attendance/analytics/risk/${selectedSection}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const assessments = {};
            res.data.forEach(item => { assessments[item._id] = item; });
            setRiskAssessments(assessments);

            const fraudRes = await axios.get(`http://localhost:5000/api/attendance/analytics/fraud/${selectedSection}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFraudAlerts(fraudRes.data.flags);
        } catch (err) {
            console.error("Behavioral Data Error:", err);
        }
    };

    const fetchRoster = async () => {
        setIsLoading(true);
        try {
            const token = user?.token;
            if (!token) {
                throw new Error("No valid authentication token found. Please log out and log in again.");
            }

            const res = await axios.get(`http://localhost:5000/api/attendance/roster/${selectedSection}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoster(res.data);
            const initialStates = {};
            res.data.forEach(s => { initialStates[s._id] = 'absent'; });
            setAttendanceStates(initialStates);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.message;
            alert(`Failed to fetch section roster: ${errorMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceStates(prev => ({ ...prev, [studentId]: status }));
    };

    const markAll = (status) => {
        const newStates = { ...attendanceStates };
        roster.forEach(student => {
            newStates[student._id] = status;
        });
        setAttendanceStates(newStates);
    };

    const submitAttendance = async () => {
        if (!selectedSection || !selectedSubject || !selectedTimeSlot) {
            alert("Please fill in all details (Section, Subject, Time Slot)");
            return;
        }

        setIsSubmitting(true);
        try {
            const attendanceDelta = Object.keys(attendanceStates).map(id => ({
                id,
                status: attendanceStates[id]
            }));

            const token = user?.token;
            if (!token) {
                throw new Error("No valid authentication token found. Please log out and log in again.");
            }

            await axios.post('http://localhost:5000/api/attendance/bulk-mark', {
                students: attendanceDelta,
                section: selectedSection,
                subject: selectedSubject,
                date: selectedDate,
                timeSlot: selectedTimeSlot
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(`✅ Attendance for ${selectedSection} submitted successfully!`);
        } catch (err) {
            alert("Error submitting attendance: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredRoster = roster.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.rollNumber || s.studentId).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: roster.length,
        present: Object.values(attendanceStates).filter(s => s === 'present').length,
        absent: Object.values(attendanceStates).filter(s => s === 'absent').length,
        late: Object.values(attendanceStates).filter(s => s === 'late').length
    };

    // --- Dynamic QR Logic ---
    const startQrSession = async () => {
        if (!selectedSection || !selectedSubject) {
            alert("Select Section and Subject first.");
            return;
        }
        try {
            const token = user?.token;
            const res = await axios.post('http://localhost:5000/api/attendance/session/start', {
                section: selectedSection,
                subject: selectedSubject
            }, { headers: { Authorization: `Bearer ${token}` } });

            setActiveSession(res.data.sessionId);
            setSessionTimer(600); // 10 mins
            fetchNewToken(res.data.sessionId);
        } catch (err) {
            alert("Error starting session: " + err.message);
        }
    };

    const fetchNewToken = async (sessionId) => {
        try {
            const token = user?.token;
            const res = await axios.get(`http://localhost:5000/api/attendance/session/token/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQrToken(res.data.token);
            setTokenTimer(10);
        } catch (err) {
            console.error("Token Fetch Error:", err);
        }
    };

    const stopQrSession = async () => {
        try {
            const token = user?.token;
            await axios.post(`http://localhost:5000/api/attendance/session/close/${activeSession}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveSession(null);
            setQrToken('');
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSessionMarks = async (sessionId) => {
        try {
            const token = user?.token;
            const res = await axios.get(`http://localhost:5000/api/attendance/session/marks/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // For each marked student, update local state to 'present'
            setAttendanceStates(prev => {
                const newStates = { ...prev };
                res.data.forEach(mark => {
                    newStates[mark.student] = 'present';
                });
                return newStates;
            });
        } catch (err) {
            console.error("Marks sync error:", err);
        }
    };

    useEffect(() => {
        let interval;
        if (activeSession && sessionTimer > 0) {
            interval = setInterval(() => {
                setSessionTimer(t => t - 1);

                // Poll for marks every 3 seconds for responsiveness
                if (sessionTimer % 3 === 0) {
                    fetchSessionMarks(activeSession);
                }

                setTokenTimer(t => {
                    if (t <= 1) {
                        fetchNewToken(activeSession);
                        return 10;
                    }
                    return t - 1;
                });
            }, 1000);
        } else if (sessionTimer === 0 && activeSession) {
            stopQrSession();
        }
        return () => clearInterval(interval);
    }, [activeSession, sessionTimer]);

    return (
        <div className="space-y-12 relative pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-neon animate-pulse shadow-[0_0_15px_#a855f7]" />
                        <h1 className="text-4xl font-black neon-text uppercase tracking-tighter">Neural Registry</h1>
                    </div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Subsystem: <span className="text-neon">ATTENDANCE-HUB-v2</span> | Status: <span className="text-white/60">ACTIVE SURVEILLANCE</span></p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    {!activeSession ? (
                        <button
                            onClick={startQrSession}
                            className="bg-neon/10 hover:bg-neon/20 text-neon px-6 py-4 rounded-2xl border-2 border-neon/30 flex items-center gap-3 transition-all active:scale-95 group"
                        >
                            <QrCode className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span className="font-black uppercase tracking-widest text-xs">Initialize QR Uplink</span>
                        </button>
                    ) : (
                        <button
                            onClick={stopQrSession}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-4 rounded-2xl border-2 border-red-500/30 flex items-center gap-3 transition-all active:scale-95 group shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                        >
                            <StopCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-black uppercase tracking-widest text-xs">Terminate Session ({Math.floor(sessionTimer / 60)}:{String(sessionTimer % 60).padStart(2, '0')})</span>
                        </button>
                    )}
                    <button
                        onClick={submitAttendance}
                        disabled={isSubmitting || roster.length === 0}
                        className="neon-button px-10 py-4 flex items-center gap-3 group relative overflow-hidden"
                    >
                        <Save className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : 'group-hover:scale-110'} transition-transform`} />
                        <span className="font-black uppercase tracking-widest text-sm relative z-10">{isSubmitting ? 'Transmitting...' : 'Commit Registry'}</span>
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {activeSession && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="flex justify-center mb-16 relative"
                    >
                        <GlassCard className="p-12 border-neon/50 border-2 flex flex-col items-center gap-10 relative overflow-hidden bg-slate-950/80 max-w-lg w-full shadow-[0_0_100px_rgba(168,85,247,0.2)] rounded-[3rem]">
                            {/* Scanning Animation Auras */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <motion.div
                                    animate={{
                                        opacity: [0.05, 0.15, 0.05],
                                        y: ['-100%', '100%']
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-neon/20 to-transparent blur-xl"
                                />
                            </div>

                            <div className="absolute top-0 right-0 p-8">
                                <div className="flex items-center gap-4 text-neon">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Entropy Link</span>
                                        <span className="text-4xl font-mono font-black tabular-nums drop-shadow-[0_0_10px_#a855f7]">{tokenTimer}s</span>
                                    </div>
                                    <Clock className="w-10 h-10 animate-spin-slow" />
                                </div>
                            </div>

                            <div className="text-center space-y-2 relative z-10 w-full pt-4">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-neon animate-ping" />
                                    <span className="text-[11px] text-neon font-black uppercase tracking-[0.5em]">Live Encryption</span>
                                </div>
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Optical Handshake</h2>
                                <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.4em] mt-2">Node Reference: {qrToken?.substring(0, 6)}...{activeSession?.substring(0, 6)}</p>
                            </div>

                            <div className="relative group p-4 border-2 border-white/5 rounded-[2.5rem] bg-white/[0.02]">
                                <div className="p-8 bg-white rounded-[2rem] shadow-[0_0_80px_rgba(168,85,247,0.3)] relative overflow-hidden">
                                    <QRCodeCanvas
                                        value={JSON.stringify({ sessionId: activeSession, token: qrToken })}
                                        size={280}
                                        level="H"
                                        includeMargin={false}
                                    />
                                    <motion.div
                                        animate={{ top: ['0%', '100%'] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1.5 bg-neon shadow-[0_0_20px_#a855f7] z-20 pointer-events-none opacity-60"
                                    />
                                </div>
                                <div className="absolute -top-3 -left-3 w-10 h-10 border-t-4 border-l-4 border-neon rounded-tl-2xl" />
                                <div className="absolute -top-3 -right-3 w-10 h-10 border-t-4 border-r-4 border-neon rounded-tr-2xl" />
                                <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-4 border-l-4 border-neon rounded-bl-2xl" />
                                <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-4 border-r-4 border-neon rounded-br-2xl" />
                            </div>

                            <div className="text-center space-y-4 relative z-10 w-full">
                                <p className="text-neon text-xs font-black animate-pulse uppercase tracking-[0.3em]">Temporal Window Authorized</p>
                                <div className="max-w-xs mx-auto px-6 py-3 bg-slate-950/60 rounded-2xl border-2 border-white/5 flex items-center justify-center gap-4 hover:border-neon/30 transition-all">
                                    <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Active Token</span>
                                    <span className="text-lg font-mono font-black text-neon tracking-[0.2em]">{qrToken}</span>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Behavioral Intelligence Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <GlassCard className="p-8 border-l-4 border-l-neon bg-slate-950/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Activity className="w-20 h-20 text-neon" />
                    </div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-neon/10 text-neon">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neon bg-neon/10 px-3 py-1 rounded-full">Integrity Index</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">
                        {selectedSection ? (Object.values(riskAssessments).filter(s => s.status === 'stable').length / (Object.keys(riskAssessments).length || 1) * 100).toFixed(0) : '--'}%
                    </h3>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Cohesion Stability Score</p>
                </GlassCard>

                <GlassCard className="p-8 border-l-4 border-l-red-500 bg-slate-950/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <ShieldAlert className="w-20 h-20 text-red-500" />
                    </div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-red-500/10 text-red-500">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 bg-red-500/10 px-3 py-1 rounded-full">Proxy Detect</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">
                        {fraudAlerts.length}
                    </h3>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Anomalous Access Points</p>
                </GlassCard>

                <GlassCard className="p-8 border-l-4 border-l-yellow-500 bg-slate-950/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <TrendingDown className="w-20 h-20 text-yellow-500" />
                    </div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-500">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">Alert Nodes</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">
                        {Object.values(riskAssessments).filter(s => s.status === 'critical').length}
                    </h3>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Students Requiring Interface</p>
                </GlassCard>
            </div>

            {fraudAlerts.length > 0 && (
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="p-6 rounded-[2rem] bg-red-500/10 border-2 border-red-500/30 flex items-center justify-between shadow-[0_0_40px_rgba(239,68,68,0.1)]"
                >
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-red-500/20 rounded-2xl animate-pulse">
                            <ShieldAlert className="w-10 h-10 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-red-500 uppercase tracking-[0.2em]">High Alert: Biometric Signature Mismatch</p>
                            <p className="text-[11px] text-white/60 font-bold uppercase tracking-tight">Multiple identity signatures detected from a single localized node. Review required immediately.</p>
                        </div>
                    </div>
                    <button className="px-8 py-3 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Review Breach</button>
                </motion.div>
            )}

            {/* Selection Panel */}
            <GlassCard className="p-8 border-2 border-white/5 bg-slate-950/40 rounded-[2.5rem]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 flex items-center gap-3">
                            <Users className="w-3.5 h-3.5 text-neon" /> Spatial Cluster
                        </label>
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="w-full bg-slate-950/60 border-2 border-white/10 rounded-2xl px-6 py-4 text-sm text-white font-bold outline-none focus:border-neon transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-slate-900">Select Section</option>
                            {sections.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 flex items-center gap-3">
                            <BookOpen className="w-3.5 h-3.5 text-accent" /> Logic Realm
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full bg-slate-950/60 border-2 border-white/10 rounded-2xl px-6 py-4 text-sm text-white font-bold outline-none focus:border-accent transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-slate-900">Select Subject</option>
                            {subjects.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 flex items-center gap-3">
                            <Calendar className="w-3.5 h-3.5 text-purple-400" /> Temporal Pivot
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full bg-slate-950/60 border-2 border-white/10 rounded-2xl px-6 py-4 text-sm text-white font-bold outline-none focus:border-purple-400 transition-all cursor-pointer"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 flex items-center gap-3">
                            <Clock className="w-3.5 h-3.5 text-green-400" /> Chrono Slot
                        </label>
                        <select
                            value={selectedTimeSlot}
                            onChange={(e) => setSelectedTimeSlot(e.target.value)}
                            className="w-full bg-slate-950/60 border-2 border-white/10 rounded-2xl px-6 py-4 text-sm text-white font-bold outline-none focus:border-green-400 transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-slate-900">Select Slot</option>
                            {timeSlots.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                        </select>
                    </div>
                </div>
            </GlassCard>

            {selectedSection ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    {/* Main Roster */}
                    <div className="lg:col-span-2 space-y-8">
                        <GlassCard className="p-0 overflow-hidden border-2 border-white/5 bg-slate-950/40 rounded-[2.5rem]">
                            <div className="p-8 border-b-2 border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/[0.01]">
                                <h3 className="font-black text-2xl flex items-center gap-4 text-white uppercase tracking-tighter">
                                    <Sparkles className="w-6 h-6 text-neon" />
                                    Identity Matrix
                                    <span className="text-[10px] px-3 py-1 rounded-full bg-neon/10 text-neon border border-neon/20 font-black tracking-widest leading-none ml-2">
                                        {filteredRoster.length} NODES
                                    </span>
                                </h3>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        type="text"
                                        placeholder="Scan name or ID signature..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-slate-950/60 border-2 border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm font-bold text-white outline-none focus:border-neon w-full sm:w-80 transition-all placeholder:text-white/10"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto min-h-[500px]">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] uppercase font-black tracking-[0.3em] text-white/20 border-b-2 border-white/5 bg-white/[0.02]">
                                            <th className="px-8 py-6">Neural Signature</th>
                                            <th className="px-8 py-6">Engagement Risk</th>
                                            <th className="px-8 py-6 text-center">Status Toggle</th>
                                            <th className="px-8 py-6 text-right">Commit State</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <AnimatePresence mode="popLayout">
                                            {isLoading ? (
                                                <tr>
                                                    <td colSpan="4" className="py-32 text-center">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#a855f7]" />
                                                            <span className="text-neon font-black tracking-[0.5em] text-xs uppercase">Deciphering Neural Link...</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : filteredRoster.length > 0 ? (
                                                filteredRoster.map(student => (
                                                    <motion.tr
                                                        key={student._id}
                                                        layout
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="hover:bg-white/[0.02] transition-colors group/row"
                                                    >
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-5">
                                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon/10 to-purple-500/10 flex items-center justify-center text-neon border-2 border-white/5 font-black text-xs group-hover/row:border-neon/30 transition-all group-hover/row:scale-110">
                                                                    {student.name.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-white group-hover/row:text-neon transition-colors tracking-tight text-lg">{student.name}</p>
                                                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">{student.rollNumber || student.studentId}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            {riskAssessments[student._id] && (
                                                                <div className="flex flex-col gap-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-3 h-3 rounded-full ${riskAssessments[student._id].status === 'stable' ? 'bg-green-500 shadow-[0_0_12px_#22c55e]' :
                                                                            riskAssessments[student._id].status === 'irregular' ? 'bg-yellow-500 shadow-[0_0_12px_#eab308]' :
                                                                                'bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse'
                                                                            }`} />
                                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                                                                            {riskAssessments[student._id].status}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[10px] text-white/20 font-bold max-w-[200px] leading-tight italic group-hover/row:text-white/40 transition-colors">"{riskAssessments[student._id].reason}"</p>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-8 py-6 text-center">
                                                            <div className="flex items-center justify-center gap-3">
                                                                {['present', 'absent', 'late'].map((status) => (
                                                                    <button
                                                                        key={status}
                                                                        onClick={() => handleStatusChange(student._id, status)}
                                                                        className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all border-2 flex items-center justify-center uppercase ${attendanceStates[student._id] === status
                                                                            ? status === 'present' ? 'bg-green-500 border-green-400 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                                                                                : status === 'absent' ? 'bg-red-500 border-red-400 text-slate-950 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                                                                                    : 'bg-yellow-500 border-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                                                                            : 'bg-slate-950/60 border-white/5 text-white/20 hover:border-white/20 hover:text-white/40'}`}
                                                                    >
                                                                        {status[0]}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <motion.span
                                                                key={attendanceStates[student._id]}
                                                                initial={{ scale: 0.9, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full inline-block border-2 ${attendanceStates[student._id] === 'present' ? 'text-green-500 bg-green-500/10 border-green-500/20' :
                                                                    attendanceStates[student._id] === 'absent' ? 'text-red-500 bg-red-500/10 border-red-500/20' :
                                                                        'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
                                                                    }`}>
                                                                {attendanceStates[student._id]}
                                                            </motion.span>
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="py-32 text-center text-white/10 font-black uppercase tracking-[0.4em] italic">Zero Signatures Detected in Cluster</td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Quick Stats & Controls */}
                    <div className="space-y-8 lg:sticky lg:top-8">
                        <GlassCard className="p-8 border-2 border-white/5 bg-slate-950/40 rounded-[2.5rem] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Filter className="w-16 h-16 text-accent" />
                            </div>
                            <h4 className="text-[11px] uppercase font-black tracking-[0.4em] text-white/20 mb-8 flex items-center gap-3">
                                <Filter className="w-4 h-4 text-accent" /> Macro Insights
                            </h4>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center p-6 rounded-[2rem] bg-slate-950/60 border-2 border-white/5 relative overflow-hidden group">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-green-500/60 uppercase tracking-widest">Active</span>
                                        <span className="text-xs font-bold text-white/60">Present Nodes</span>
                                    </div>
                                    <motion.span
                                        key={stats.present}
                                        initial={{ scale: 1.5, color: '#22c55e' }}
                                        animate={{ scale: 1, color: '#22c55e' }}
                                        className="text-4xl font-black tabular-nums tracking-tighter"
                                    >
                                        {stats.present}
                                    </motion.span>
                                    <AnimatePresence>
                                        <motion.div
                                            key={`pulse-${stats.present}`}
                                            initial={{ scale: 0.8, opacity: 0.5 }}
                                            animate={{ scale: 2, opacity: 0 }}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-green-500/20"
                                        />
                                    </AnimatePresence>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col p-6 rounded-[2rem] bg-slate-950/60 border-2 border-white/5">
                                        <span className="text-[10px] font-black text-red-500/60 uppercase tracking-widest mb-2">Void</span>
                                        <span className="text-3xl font-black text-red-500 tabular-nums">{stats.absent}</span>
                                    </div>
                                    <div className="flex flex-col p-6 rounded-[2rem] bg-slate-950/60 border-2 border-white/5">
                                        <span className="text-[10px] font-black text-yellow-500/60 uppercase tracking-widest mb-2">Lag</span>
                                        <span className="text-3xl font-black text-yellow-500 tabular-nums">{stats.late}</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t-2 border-white/5 mt-4">
                                    <div className="flex items-center justify-between font-black text-[10px] uppercase tracking-[0.3em] mb-3">
                                        <span className="text-white/20">Node Saturation</span>
                                        <span className="text-neon">{Math.round((stats.present / stats.total) * 100) || 0}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-950/80 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(stats.present / stats.total) * 100 || 0}%` }}
                                            className="h-full bg-neon shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-700 relative"
                                        >
                                            <div className="absolute top-0 right-0 h-full w-2 bg-white/30 blur-[1px]" />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-8 bg-gradient-to-br from-neon/10 via-slate-950/40 to-slate-950/80 border-2 border-white/5 rounded-[2.5rem]">
                            <h4 className="text-[11px] uppercase font-black tracking-[0.4em] text-white/20 mb-8 flex items-center gap-3">
                                <RotateCcw className="w-4 h-4 text-neon" /> Matrix Override
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => markAll('present')}
                                        className="py-5 rounded-2xl bg-green-500/10 border-2 border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest hover:bg-green-500/20 hover:border-green-500/40 transition-all"
                                    >
                                        Sync All
                                    </button>
                                    <button
                                        onClick={() => markAll('absent')}
                                        className="py-5 rounded-2xl bg-red-500/10 border-2 border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                                    >
                                        Purge All
                                    </button>
                                </div>
                                <button
                                    onClick={() => setAttendanceStates(prev => {
                                        const reset = {};
                                        roster.forEach(s => reset[s._id] = 'present');
                                        return reset;
                                    })}
                                    className="w-full py-4 rounded-2xl bg-white/[0.02] border-2 border-white/5 text-white/20 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white/40 transition-all"
                                >
                                    Hard Matrix Reset
                                </button>
                            </div>
                        </GlassCard>

                        <div className="p-8 rounded-[2.5rem] bg-amber-500/10 border-2 border-amber-500/20 flex gap-6 items-start">
                            <div className="p-3 bg-amber-500/20 rounded-2xl">
                                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2">Protocol Warning</p>
                                <p className="text-xs text-white/50 leading-relaxed font-bold">
                                    Committing this registry will asynchronously update Neural Forecasts and trigger parent-uplink protocols immediately. Finalize with caution.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <GlassCard className="py-40 flex flex-col items-center justify-center text-center border-4 border-dashed border-white/5 bg-transparent rounded-[3rem]">
                    <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] flex items-center justify-center mb-8 border-2 border-white/5 shadow-inner">
                        <Users className="w-10 h-10 text-white/10 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-black text-white/20 mb-3 uppercase tracking-[0.5em]">Awaiting Cluster Input</h2>
                    <p className="text-white/10 text-sm max-w-sm mx-auto font-bold uppercase tracking-tight">Initialize the spatial cluster selection to decypher the student identity matrix.</p>
                </GlassCard>
            )}
        </div>
    );
};

export default Attendance;
