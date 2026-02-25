import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Book, CheckCircle2, Circle, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ResourceDrawer from '../components/ResourceDrawer';

const Curriculum = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [subjects, setSubjects] = useState(() => {
        // Clear old legacy data if it exists
        localStorage.removeItem('curriculum_data');

        const saved = localStorage.getItem('curriculum_data_v2');
        return saved ? JSON.parse(saved) : [
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
    });

    useEffect(() => {
        localStorage.setItem('curriculum_data_v2', JSON.stringify(subjects));
    }, [subjects]);

    const toggleTopic = (subId, topicId) => {
        setSubjects(prev => prev.map(sub => {
            if (sub.id !== subId) return sub;
            return {
                ...sub,
                topics: sub.topics.map(t =>
                    t.id === topicId ? { ...t, completed: !t.completed } : t
                )
            };
        }));
    };

    const calculateProgress = (topics) => {
        const completed = topics.filter(t => t.completed).length;
        return Math.round((completed / topics.length) * 100);
    };

    return (
        <div className="space-y-12 relative pb-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-neon animate-pulse shadow-[0_0_15px_#a855f7]" />
                        <h1 className="text-4xl font-black neon-text uppercase tracking-tighter">Syllabus Matrix</h1>
                    </div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Protocol: <span className="text-neon">CURRICULUM-MONITOR-v4</span> | Status: <span className="text-white/60">SYNCHRONIZED</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {subjects.map((sub, i) => (
                    <GlassCard key={i} className="flex flex-col gap-8 p-10 border-2 border-white/5 bg-slate-950/40 relative overflow-hidden group hover:border-neon/30 transition-all duration-500">
                        {/* Background Pulsing Grid */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                            <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                        </div>

                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-neon transition-colors leading-tight">{sub.name}</h3>
                                <div className="flex items-center gap-3 text-[10px] text-white/30 font-black uppercase tracking-widest">
                                    <Sparkles className="w-4 h-4 text-neon animate-pulse" />
                                    AI Forecast: <span className="text-neon">{sub.forecast}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <motion.span
                                    key={calculateProgress(sub.topics)}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-4xl font-black neon-text drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                                >
                                    {calculateProgress(sub.topics)}%
                                </motion.span>
                                <p className="text-[9px] text-white/20 uppercase font-black tracking-[0.3em] mt-1">Completion</p>
                            </div>
                        </div>

                        {/* Progress Bar Extraordinary */}
                        <div className="h-3 w-full bg-slate-950/60 rounded-full overflow-hidden border border-white/5 relative">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${calculateProgress(sub.topics)}%` }}
                                className="h-full bg-neon-gradient relative"
                            >
                                <div className="absolute top-0 right-0 h-full w-3 bg-white/40 blur-[2px]" />
                            </motion.div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2 border-b border-white/5 pb-2">Knowledge Segments</p>
                            <div className="grid grid-cols-1 gap-3">
                                {sub.topics.map((topic) => (
                                    <motion.div
                                        key={topic.id}
                                        whileHover={{ x: 5 }}
                                        onClick={() => toggleTopic(sub.id, topic.id)}
                                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${topic.completed
                                            ? 'bg-neon/10 border-neon/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]'
                                            : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 ${topic.completed ? 'bg-neon border-neon text-slate-950' : 'border-white/10 text-white/10'}`}>
                                                {topic.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
                                            </div>
                                            <span className={`text-sm font-bold tracking-tight ${topic.completed ? 'text-white' : 'text-white/40'}`}>{topic.title}</span>
                                        </div>
                                        {topic.completed && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="text-[9px] text-neon font-black font-mono tracking-widest bg-neon/10 px-2 py-0.5 rounded-md border border-neon/20"
                                            >
                                                SYNKED
                                            </motion.span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedSubject(sub);
                                setIsDrawerOpen(true);
                            }}
                            className="mt-4 group/btn py-4 px-6 rounded-2xl border-2 border-accent/20 text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center justify-center gap-3 hover:bg-accent/10 hover:border-accent/40 transition-all"
                        >
                            Decipher Research Materials <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                    </GlassCard>
                ))}
            </div>

            {/* Resource Drawer Integration */}
            <ResourceDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                subject={selectedSubject}
            />
        </div>
    );
};

export default Curriculum;
