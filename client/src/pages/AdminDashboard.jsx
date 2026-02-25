import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Users, UserCircle, BookOpen, Clock, TrendingUp, Sparkles, CheckCircle, Shield, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';
import CurriculumSummary from '../components/CurriculumSummary';

const deptData = [
    { name: 'CS', performance: 88, research: 72 },
    { name: 'EE', performance: 82, research: 65 },
    { name: 'ME', performance: 75, research: 58 },
    { name: 'CE', performance: 78, research: 60 },
];

const AdminDashboard = () => {
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

    const [stats, setStats] = useState({
        students: '1,280',
        teachers: '45',
        attendance: '84%',
        budget: '$1.2M',
        health: 'Optimal'
    });
    const [atRiskStudents, setAtRiskStudents] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [users, setUsers] = useState([
        { id: 1, name: 'Mukti Verma', role: 'Teacher', email: 'mukti@edu.com', dept: 'CS', section: 'Global' },
        { id: 2, name: 'Prashant Singh', role: 'Teacher', email: 'prashant@edu.com', dept: 'CS', section: 'Global' },
        { id: 3, name: 'Ajay Kumar', role: 'Teacher', email: 'ajay@edu.com', dept: 'Humanities', section: 'Global' },
        { id: 4, name: 'Ridhima Shrivastava', role: 'Teacher', email: 'ridhima@edu.com', dept: 'Math', section: 'Global' },
        { id: 5, name: 'Aditya Singh', role: 'Teacher', email: 'aditya@edu.com', dept: 'CS', section: 'Global' },
        { id: 6, name: 'Sanjana', role: 'Teacher', email: 'sanjana@edu.com', dept: 'CS', section: 'Global' },
        { id: 7, name: 'Mohit Sharma', role: 'Teacher', email: 'mohit@edu.com', dept: 'CS', section: 'Global' },
        { id: 8, name: 'Mukul Raj', role: 'Teacher', email: 'mukul@edu.com', dept: 'English', section: 'Global' },
        { id: 9, name: 'Sarah Connor', role: 'Admin', email: 'sarah@edu.com', dept: 'Global', section: 'Global' },
    ]);

    const handleGenerateAudit = () => {
        alert("Generating Institutional Audit...\n\n- Analyzing Payroll & Budgets\n- Compiling Multi-Dept Progress\n- AI Data Ready for Administrative Preview.");
    };

    const handleAddUser = () => {
        const name = prompt("Enter full name:");
        const role = prompt("Enter role (Teacher/Student/Admin):");
        const email = prompt("Enter email:");
        const section = prompt("Enter Section (K26PS, K26ND, K26SR, K26WT, K26SF) or leave blank:");
        if (name && role && email) {
            setUsers(prev => [...prev, { id: Date.now(), name, role, email, dept: 'New Dept', section: section || 'N/A' }]);
            alert(`User ${name} added successfully!`);
        }
    };

    const handleModifyUser = (id) => {
        const user = users.find(u => u.id === id);
        const newName = prompt(`Modify name for ${user.name}:`, user.name);
        const newSection = prompt(`Modify Section for ${user.name}:`, user.section || 'N/A');
        if (newName) {
            setUsers(prev => prev.map(u => u.id === id ? { ...u, name: newName, section: newSection } : u));
        }
    };

    const handleRevokeUser = (id) => {
        if (window.confirm("Are you sure you want to revoke access for this user?")) {
            setUsers(prev => prev.filter(u => u.id !== id));
            alert("Access revoked.");
        }
    };

    const handleExportCSV = () => {
        alert("Preparing User Directory CSV...\n\nDownloading 'institution_users_audit.csv' in a few seconds.");
    };

    const runRiskAnalysis = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setAtRiskStudents([
                { id: 1, name: 'Aryan Sharma', reason: 'Attendance dropped to 62% this week', risk: 'High' },
                { id: 2, name: 'Priya Singh', reason: 'Failed 2 consecutive AI Ethics quizzes', risk: 'Medium' }
            ]);
            setIsAnalyzing(false);
        }, 1500);
    };

    const handleContactStudent = (name) => {
        alert(`Initiating AI intervention for ${name}...\n\n- Automated email sent to student.\n- Slack notification sent to Department Head.\n- Follow-up meeting scheduled.`);
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-neon animate-pulse shadow-[0_0_15px_#a855f7]" />
                        <h1 className="text-4xl font-black neon-text uppercase tracking-tighter">Command Center</h1>
                    </div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Institutional Grade Surveillance & Logic</p>
                </div>
                <button
                    onClick={handleGenerateAudit}
                    className="neon-button transition-all flex items-center gap-3 group/btn px-8"
                >
                    <Briefcase className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                    <span className="relative z-10 font-black">Generate Full Audit</span>
                </button>
            </div>

            {/* Macro Stats Grid - Extraordinary Edition */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassCard className="flex flex-col gap-3 border-neon/30 border-2 bg-gradient-to-br from-neon/5 to-transparent relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Users className="w-12 h-12 text-neon" />
                    </div>
                    <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-black">Global Enrollment</span>
                    <span className="text-4xl font-black text-white">{stats.students}</span>
                    <div className="text-[10px] text-neon flex items-center gap-2 mt-2 font-black bg-neon/10 px-3 py-1 rounded-full w-fit">
                        <TrendingUp className="w-3 h-3" /> +12% GROWTH
                    </div>
                </GlassCard>

                <GlassCard className="flex flex-col gap-3 border-accent/30 border-2 bg-gradient-to-br from-accent/5 to-transparent relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-12 h-12 text-accent" />
                    </div>
                    <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-black">Operating Budget</span>
                    <span className="text-4xl font-black text-accent">{stats.budget}</span>
                    <div className="text-[10px] text-accent flex items-center gap-2 mt-2 font-black bg-accent/10 px-3 py-1 rounded-full w-fit">
                        <Sparkles className="w-3 h-3" /> 18% OPTIMIZED
                    </div>
                </GlassCard>

                <GlassCard className="flex flex-col gap-3 border-green-500/30 border-2 bg-gradient-to-br from-green-500/5 to-transparent relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <UserCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-black">Staff Efficiency</span>
                    <span className="text-4xl font-black text-green-500">92%</span>
                    <div className="text-[10px] text-green-500 flex items-center gap-2 mt-2 font-black bg-green-500/10 px-3 py-1 rounded-full w-fit">
                        <Users className="w-3 h-3" /> {stats.teachers} ACTIVE
                    </div>
                </GlassCard>

                <GlassCard className="flex flex-col gap-3 border-purple-500/30 border-2 bg-gradient-to-br from-purple-500/5 to-transparent relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Shield className="w-12 h-12 text-purple-500" />
                    </div>
                    <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-black">Access Health</span>
                    <span className="text-4xl font-black text-purple-500">OPTIMAL</span>
                    <div className="text-[10px] text-purple-500 flex items-center gap-2 mt-2 font-black bg-purple-500/10 px-3 py-1 rounded-full w-fit">
                        <Shield className="w-3 h-3" /> 99.9% UPTIME
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Extraordinary User Management */}
                <GlassCard className="lg:col-span-2 flex flex-col gap-8 border-white/5 relative bg-white/[0.01]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-neon/10 rounded-2xl">
                                <Users className="w-8 h-8 text-neon" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Unified Directory</h3>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Personnel Authorization Registry</p>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <button
                                onClick={handleExportCSV}
                                className="flex-1 sm:flex-none text-[10px] px-6 py-4 rounded-2xl border-2 border-white/10 hover:bg-white/5 transition-all font-black uppercase tracking-widest text-white/60"
                            >
                                Dump Data
                            </button>
                            <button
                                onClick={handleAddUser}
                                className="flex-1 sm:flex-none text-[10px] px-6 py-4 rounded-2xl bg-neon text-slate-950 transition-all font-black uppercase tracking-widest shadow-[0_0_20px_#a855f7]/30 hover:scale-[1.05]"
                            >
                                Deploy Profile
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-black px-6">
                                    <th className="px-6 pb-2">Identity & Signature</th>
                                    <th className="px-6 pb-2">Authorization</th>
                                    <th className="px-6 pb-2">Assignment</th>
                                    <th className="px-6 pb-2 text-right">System Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="group transition-all">
                                        <td className="px-6 py-5 rounded-l-[1.5rem] bg-white/[0.03] group-hover:bg-neon/5 border-y-2 border-l-2 border-white/5 group-hover:border-neon/20 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-neon-gradient flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:shadow-neon/20 transition-all">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-base tracking-tight">{user.name}</p>
                                                    <p className="text-[10px] text-white/30 font-mono">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 bg-white/[0.03] group-hover:bg-neon/5 border-y-2 border-white/5 group-hover:border-neon/20 transition-all">
                                            <span className={`text-[9px] px-3 py-1.5 rounded-lg font-black uppercase tracking-[0.1em] ${user.role === 'Admin' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                                                user.role === 'Teacher' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 bg-white/[0.03] group-hover:bg-neon/5 border-y-2 border-white/5 group-hover:border-neon/20 transition-all">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] font-black text-neon uppercase tracking-widest">{user.section || 'SYSTEM'}</span>
                                                <span className="text-[10px] text-white/30 font-bold uppercase">{user.dept}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 rounded-r-[1.5rem] bg-white/[0.03] group-hover:bg-neon/5 border-y-2 border-r-2 border-white/5 group-hover:border-neon/20 text-right transition-all">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleModifyUser(user.id)}
                                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-neon hover:text-slate-950 transition-all border border-white/10 hover:border-neon"
                                                    title="Modify Identity"
                                                >
                                                    <Sparkles className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleRevokeUser(user.id)}
                                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-white/10 hover:border-red-500"
                                                    title="Revoke Access"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>

                <div className="space-y-8">
                    {/* Departmental Performance - Exclusive Macro View */}
                    <GlassCard className="h-[350px]">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-bold flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-neon" />
                                Departmental Scorecard
                            </h3>
                            <span className="text-[10px] px-2 py-1 rounded bg-neon/10 text-neon font-black">LIVE DIAGNOSTIC</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff30" axisLine={false} tickLine={false} />
                                <YAxis stroke="#ffffff30" axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff03' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                />
                                <Bar dataKey="performance" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                                <Bar dataKey="research" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </GlassCard>

                    {/* Integrated Curriculum Oversight */}
                    <CurriculumSummary subjects={curriculumSubjects} />

                    {/* Integrated Warning System */}
                    <GlassCard className="flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-neon" />
                                Crisis Intervention
                            </h3>
                            <button
                                onClick={runRiskAnalysis}
                                disabled={isAnalyzing}
                                className={`text-[9px] px-4 py-2 rounded-xl font-black uppercase tracking-tighter transition-all ${isAnalyzing ? 'bg-white/5 text-white/20 animate-pulse' : 'bg-neon/10 text-neon hover:bg-neon/20 border border-neon/30'
                                    }`}
                            >
                                {isAnalyzing ? 'SCANNING SYSTEM...' : 'INITIATE RISK SCAN'}
                            </button>
                        </div>
                        <div className="space-y-3">
                            {atRiskStudents.length > 0 ? atRiskStudents.map(student => (
                                <div key={student.id} className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/10 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-black text-red-500">{student.name}</p>
                                        <p className="text-[10px] text-white/40">{student.reason}</p>
                                    </div>
                                    <button
                                        onClick={() => handleContactStudent(student.name)}
                                        className="text-[9px] font-black uppercase text-red-500 border border-red-500/20 px-2 py-1 rounded hover:bg-red-500/10 transition-all"
                                    >
                                        ALERT
                                    </button>
                                </div>
                            )) : (
                                <div className="py-6 text-center">
                                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2 text-green-500">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">System Clear</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div >
    );
};

export default AdminDashboard;
