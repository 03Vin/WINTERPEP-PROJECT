import React, { useState, useEffect, useMemo } from 'react';
import GlassCard from '../components/GlassCard';
import { Calendar, Clock, MapPin, Sparkles, Filter, User, ChevronRight, ChevronDown, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SECTIONS = ['K26PS', 'K26ND', 'K26SR', 'K26WT', 'K26SF'];

const TEACHER_ASSIGNMENTS = [
    { name: 'Mukti Verma', subject: 'INT656 : ADVANCED WEB DEVELOPENT', room: 'Lab-A' },
    { name: 'Prashant Singh', subject: 'INT545 : WEB APP DEVELOPMENT WITH REACTJS', room: 'Lab-B' },
    { name: 'Ajay Kumar', subject: 'PEA333 : ANALYTICAL SKILLS', room: 'R-101' },
    { name: 'Ridhima Shrivastava', subject: 'MTH290 : PROBABILITY AND STATISTICS', room: 'R-202' },
    { name: 'Aditya Singh', subject: 'CSE202 : PROGRAMMING IN C++', room: 'Lab-C' },
    { name: 'Sanjana', subject: 'CSE205 : DATA STUCTURES AND ALGORITHMS', room: 'Lab-D' },
    { name: 'Mohit Sharma', subject: 'CSE306 : COMPUTER NETWORKS', room: 'R-301' },
    { name: 'Mukul Raj', subject: 'PEL136 : COMMUNICATION SKILLS', room: 'Auditorium' }
];

const Timetable = () => {
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState(user?.role === 'teacher' ? 'personal' : 'section');
    const [selectedSection, setSelectedSection] = useState(user?.section || SECTIONS[0]);
    const [isSolving, setIsSolving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [scheduleData, setScheduleData] = useState([]); // Array of days with slots
    const [activeDay, setActiveDay] = useState('Monday');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const slots = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 01:00', '14:00 - 15:00', '15:00 - 16:00'];

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        setIsLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const res = await axios.get('http://localhost:5000/api/timetable', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setScheduleData(res.data);
        } catch (err) {
            console.error("Error fetching timetable:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const currentDisplayDay = scheduleData.find(d => d.day === activeDay) || { slots: [] };

    // Grouping slots by time string for easy lookup
    const slotMap = {};
    currentDisplayDay.slots.forEach(slot => {
        const key = `${slot.startTime} - ${slot.endTime}`;
        slotMap[key] = slot;
    });

    const generateSchedule = async () => {
        if (user?.role !== 'admin') return;
        setIsSolving(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            await axios.post('http://localhost:5000/api/timetable/optimize', {
                section: selectedSection
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchTimetable();
            alert(`✨ AI Schedule Optimized for ${selectedSection}!`);
        } catch (err) {
            alert("Error optimizing timetable");
        } finally {
            setIsSolving(false);
        }
    };

    return (
        <div className="space-y-10 relative pb-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-neon animate-pulse shadow-[0_0_15px_#a855f7]" />
                        <h1 className="text-4xl font-black neon-text uppercase tracking-tighter">Temporal Uplink</h1>
                    </div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
                        {viewMode === 'personal'
                            ? `Personalized Engagement Matrix for ${user?.role === 'teacher' ? 'Your Assigned Sectors' : user?.name}`
                            : 'Multi-cluster AI temporal mapping system.'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    {user?.role === 'admin' && (
                        <div className="flex items-center gap-2 bg-slate-950/40 p-1.5 rounded-2xl border-2 border-white/5 shadow-inner">
                            <button
                                onClick={() => setViewMode('section')}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'section' ? 'bg-accent text-slate-950 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'text-white/30 hover:text-white/60'}`}
                            >
                                <Filter className="w-3 h-3 inline mr-2" /> Sector
                            </button>
                            <button
                                onClick={() => setViewMode('personal')}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'personal' ? 'bg-neon text-slate-950 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'text-white/30 hover:text-white/60'}`}
                            >
                                <User className="w-3 h-3 inline mr-2" /> Persona
                            </button>
                        </div>
                    )}

                    {user?.role === 'admin' && viewMode === 'section' && (
                        <div className="flex items-center gap-1.5 bg-slate-950/40 p-1.5 rounded-2xl border-2 border-white/5 overflow-x-auto scrollbar-hide max-w-[300px] sm:max-w-none">
                            {SECTIONS.map(sec => (
                                <button
                                    key={sec}
                                    onClick={() => setSelectedSection(sec)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-tighter transition-all ${selectedSection === sec ? 'bg-neon/20 text-neon border border-neon/30' : 'text-white/30 border border-transparent hover:border-white/10'}`}
                                >
                                    {sec}
                                </button>
                            ))}
                        </div>
                    )}

                    {user?.role === 'admin' && viewMode === 'section' && (
                        <button
                            onClick={generateSchedule}
                            disabled={isSolving}
                            className={`neon-button flex items-center justify-center gap-2 py-3 px-8 text-xs min-w-[180px] ${isSolving ? 'animate-pulse opacity-50' : ''}`}
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="font-black uppercase tracking-widest">{isSolving ? 'Optimizing...' : 'Initialize AI Sync'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* DAY SELECTOR TABS */}
            <div className="flex items-center gap-3 bg-white/[0.01] p-2 rounded-[2rem] border-2 border-white/5 overflow-x-auto scrollbar-hide shadow-inner">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`flex-grow px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group ${activeDay === day
                            ? 'bg-neon text-slate-950 shadow-[0_0_30px_rgba(168,85,247,0.4)]'
                            : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                            }`}
                    >
                        {day}
                        {activeDay === day && (
                            <motion.div
                                layoutId="daySelectorActive"
                                className="absolute bottom-0 left-0 w-full h-1 bg-white/40 blur-[1px]"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Swapping Table Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeDay}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    <GlassCard className="overflow-hidden border-2 border-white/5 bg-slate-950/40 relative">
                        {/* Background Scanline Pattern */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 text-left text-[11px] uppercase font-black tracking-[0.3em] text-white/30 bg-white/[0.04] w-48 border-r border-white/5">Temporal Slot</th>
                                    <th className="p-6 text-left text-[11px] uppercase font-black tracking-[0.3em] text-neon bg-white/[0.04]">
                                        <div className="flex items-center gap-3">
                                            {activeDay} Engagement Matrix
                                            <div className="w-2 h-2 rounded-full bg-neon animate-pulse shadow-[0_0_10px_#a855f7]" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="2" className="p-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#a855f7]" />
                                                <span className="text-white/20 font-black uppercase tracking-[0.5em] text-xs">Synchronizing Master Schedule...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : slots.map((slot) => (
                                    <tr key={slot} className="group/row hover:bg-white/[0.02] transition-all">
                                        <td className="p-8 text-sm font-black text-accent whitespace-nowrap bg-white/[0.01] border-r border-white/5 flex flex-col items-start gap-1">
                                            <Clock className="w-4 h-4 mb-2 opacity-40 group-hover/row:scale-110 transition-transform" />
                                            {slot}
                                        </td>
                                        <td className="p-6">
                                            {slotMap[slot] ? (
                                                <motion.div
                                                    whileHover={{ x: 10 }}
                                                    className="p-8 rounded-[2rem] border-2 transition-all bg-gradient-to-br from-neon/10 via-transparent to-transparent border-neon/30 relative overflow-hidden group/card"
                                                >
                                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/card:scale-110 group-hover/card:rotate-12 transition-all">
                                                        <Sparkles className="w-24 h-24 text-neon" />
                                                    </div>

                                                    <h3 className="font-black text-xl mb-4 text-white uppercase tracking-tighter group-hover/card:text-neon transition-colors">
                                                        {slotMap[slot].subject}
                                                    </h3>

                                                    <div className="flex flex-wrap gap-10">
                                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                                                            <div className="p-2 bg-neon/10 rounded-xl">
                                                                <User className="w-4 h-4 text-neon" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-white/20">Authorized Faculty</span>
                                                                <span className="text-white/70">{slotMap[slot].teacher?.name || 'GENERIC-LINK-M1'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                                                            <div className="p-2 bg-accent/10 rounded-xl">
                                                                <MapPin className="w-4 h-4 text-accent" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-white/20">Spatial Sector</span>
                                                                <span className="text-white/70">{slotMap[slot].room || 'LAB-ALPHA'}</span>
                                                            </div>
                                                        </div>
                                                        {user?.role !== 'student' && slotMap[slot].classId && (
                                                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                                                                <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-white/40">
                                                                    <Filter className="w-4 h-4" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-neon/30">Target Section</span>
                                                                    <span className="text-neon">{slotMap[slot].classId}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div className="h-32 rounded-[2rem] border-2 border-dashed border-white/5 flex items-center justify-center group/empty">
                                                    <span className="text-[10px] font-black text-white/5 uppercase tracking-[0.5em] group-hover/empty:text-white/10 transition-colors">Temporal Dead Zone</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </GlassCard>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Timetable;
