import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import {
    Search, Library, Filter, BookOpen,
    FileText, Video, ExternalLink, Sparkles,
    ChevronRight, Cloud, Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ResourceDrawer from '../components/ResourceDrawer';

const Resources = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [allResources, setAllResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const subjects = [
        { code: 'INT656', name: 'INT656 : ADVANCED WEB DEVELOPENT', category: 'Technical' },
        { code: 'INT545', name: 'INT545 : WEB APP DEVELOPMENT WITH REACTJS', category: 'Technical' },
        { code: 'PEA333', name: 'PEA333 : ANALYTICAL SKILLS', category: 'Aptitude' },
        { code: 'MTH290', name: 'MTH290 : PROBABILITY AND STATISTICS', category: 'Math' },
        { code: 'CSE202', name: 'CSE202 : PROGRAMMING IN C++', category: 'Programming' },
        { code: 'CSE205', name: 'CSE205 : DATA STUCTURES AND ALGORITHMS', category: 'Programming' },
        { code: 'CSE306', name: 'CSE306 : COMPUTER NETWORKS', category: 'Networking' },
        { code: 'PEL136', name: 'PEL136 : COMMUNICATION SKILLS', category: 'Soft Skills' }
    ];

    useEffect(() => {
        fetchLibrary();
    }, []);

    const fetchLibrary = async () => {
        setIsLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const res = await axios.get('http://localhost:5000/api/resources/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllResources(res.data);
        } catch (err) {
            console.error("Library Fetch Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const getResourceCount = (code) => {
        return allResources.filter(r => r.subjectId === code).length;
    };

    const filteredSubjects = subjects.filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || sub.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const categories = ['All', ...new Set(subjects.map(s => s.category))];

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black neon-text tracking-tighter uppercase italic">Institutional Library</h1>
                    <p className="text-white/60 flex items-center gap-2">
                        <Cloud className="w-4 h-4 text-neon" />
                        Connected to AIvent Cloud Storage (Syncing Live)
                    </p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon transition-colors" />
                        <input
                            type="text"
                            placeholder="Search notes, videos, labs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-neon/50 focus:bg-neon/5 transition-all text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === cat
                                ? 'bg-neon text-black shadow-lg shadow-neon/20'
                                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/80'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Main Library Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredSubjects.map((sub, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <GlassCard
                            onClick={() => {
                                setSelectedSubject(sub.name);
                                setIsDrawerOpen(true);
                            }}
                            className="group p-6 hover:border-neon/30 hover:bg-neon/5 transition-all cursor-pointer h-full flex flex-col justify-between overflow-hidden relative"
                        >
                            {/* Visual Polish */}
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/5 rounded-full blur-2xl group-hover:bg-neon/20 transition-all"></div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-neon/30 transition-all">
                                        <BookOpen className="w-5 h-5 text-white/40 group-hover:text-neon" />
                                    </div>
                                    <span className="text-[9px] px-2 py-1 rounded bg-white/5 text-white/30 font-black tracking-widest uppercase group-hover:text-neon transition-colors">
                                        {sub.category}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-sm font-black text-white/80 group-hover:text-white transition-colors leading-relaxed">
                                        {sub.name}
                                    </h3>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                                        {isLoading ? '...' : getResourceCount(sub.code)} Academic Assets
                                    </p>
                                </div>
                            </div>

                            <button className="mt-6 flex items-center justify-between group/btn pt-4 border-t border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/btn:text-neon transition-colors italic">Explore Folder</span>
                                <ChevronRight className="w-4 h-4 text-white/10 group-hover/btn:text-neon transition-all group-hover/btn:translate-x-1" />
                            </button>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Featured Resources Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
                <GlassCard className="lg:col-span-2 p-8 border-l-4 border-l-accent bg-accent/5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-accent text-[10px] font-black uppercase tracking-widest">
                                <Sparkles className="w-4 h-4" />
                                Trending Asset
                            </div>
                            <h2 className="text-2xl font-black text-white italic">AI Ethics in Modern Engineering (PDF)</h2>
                            <p className="text-sm text-white/40 max-w-md">The most downloaded research paper this week across all sections including K26ND and K26SF.</p>
                        </div>
                        <button
                            onClick={() => window.open('https://hbr.org/2023/04/how-to-write-a-better-email', '_blank')}
                            className="neon-button !bg-accent shadow-lg shadow-accent/20 flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Direct Download
                        </button>
                    </div>
                </GlassCard>

                <GlassCard className="p-8 group hover:bg-neon/5 transition-all text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-neon/10 transition-colors border border-white/5">
                        <ExternalLink className="w-8 h-8 text-white/10 group-hover:text-neon" />
                    </div>
                    <div>
                        <h4 className="font-black text-white italic">External Research Hub</h4>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1 italic">IEEE & ACM Digital Access</p>
                    </div>
                    <button
                        onClick={() => window.open('https://ieeexplore.ieee.org/Xplore/home.jsp', '_blank')}
                        className="text-[10px] font-black uppercase tracking-widest text-neon border-b border-neon/20 pb-1 hover:border-neon transition-all"
                    >
                        Launch Access Portal
                    </button>
                </GlassCard>
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

export default Resources;
