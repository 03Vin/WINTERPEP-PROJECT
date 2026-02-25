import React from 'react';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Book, Award, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-12 relative pb-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-neon animate-pulse shadow-[0_0_15px_#a855f7]" />
                        <h1 className="text-4xl font-black neon-text uppercase tracking-tighter">Neural Identity</h1>
                    </div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Sector: <span className="text-neon">{user?.role || 'SYSTEM'}</span> | Protocol: <span className="text-white/60">AUTHORIZED</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Neural Identity Card */}
                <GlassCard className="flex flex-col items-center text-center p-12 border-neon/30 border-2 bg-gradient-to-br from-neon/5 to-transparent relative overflow-hidden group">
                    {/* Background SVG Grid Accents */}
                    <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" viewBox="0 0 100 100">
                        <line x1="20" y1="0" x2="20" y2="100" stroke="white" strokeWidth="0.1" />
                        <line x1="80" y1="0" x2="80" y2="100" stroke="white" strokeWidth="0.1" />
                        <line x1="0" y1="20" x2="100" y2="20" stroke="white" strokeWidth="0.1" />
                    </svg>

                    <div className="relative mb-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-4 border-2 border-dashed border-neon/20 rounded-full"
                        />
                        <div className="w-32 h-32 rounded-3xl bg-neon-gradient p-1 shadow-[0_0_40px_rgba(168,85,247,0.2)] group-hover:scale-105 transition-transform">
                            <div className="w-full h-full rounded-[1.4rem] bg-slate-950 flex items-center justify-center relative overflow-hidden">
                                <User className="w-16 h-16 text-white/90" />
                                <div className="absolute inset-0 bg-neon/5 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">{user?.name || 'Administrator'}</h2>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-ping" />
                            <p className="text-neon text-[10px] font-black uppercase tracking-[0.3em]">{user?.role || 'System Admin'}</p>
                        </div>
                    </div>

                    <div className="w-full space-y-5 text-left relative z-10">
                        <div className="group/row flex items-center gap-5 p-5 rounded-2xl bg-white/[0.02] border-2 border-white/5 hover:border-neon/20 transition-all">
                            <div className="p-3 bg-white/5 rounded-xl group-hover/row:bg-neon/10 transition-all">
                                <Mail className="w-5 h-5 text-white/40 group-hover/row:text-neon" />
                            </div>
                            <div>
                                <p className="text-[8px] text-white/30 uppercase font-black tracking-widest">Digital Signature</p>
                                <p className="text-xs font-mono text-white/80">{user?.email || 'admin@smartacad.sys'}</p>
                            </div>
                        </div>
                        <div className="group/row flex items-center gap-5 p-5 rounded-2xl bg-white/[0.02] border-2 border-white/5 hover:border-neon/20 transition-all">
                            <div className="p-3 bg-white/5 rounded-xl group-hover/row:bg-neon/10 transition-all">
                                <Shield className="w-5 h-5 text-white/40 group-hover/row:text-neon" />
                            </div>
                            <div>
                                <p className="text-[8px] text-white/30 uppercase font-black tracking-widest">Tactical Dept</p>
                                <p className="text-xs font-black text-white/80 uppercase">{user?.department || 'Computer Science'}</p>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Cognitive Summary */}
                <div className="lg:col-span-2 space-y-10">
                    <GlassCard className="p-10 border-accent/20 border-2 bg-gradient-to-br from-accent/5 to-transparent relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                            <Award className="w-32 h-32 text-accent" />
                        </div>

                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-accent/10 rounded-2xl">
                                <Award className="w-8 h-8 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Yield Metrics</h3>
                                <p className="text-[10px] text-accent/60 font-black uppercase tracking-widest mt-1">Academic Performance Diagnostic</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="p-6 rounded-3xl bg-slate-950/40 border-2 border-white/5 hover:border-accent/20 transition-all">
                                <p className="text-white/30 text-[9px] uppercase font-black tracking-widest mb-4">Authorized Modules</p>
                                <div className="flex flex-wrap gap-3">
                                    {(user?.subjects || ['Advanced Mathematics', 'Database Systems']).map((sub, i) => (
                                        <span key={i} className="px-4 py-2 rounded-xl bg-accent/10 border-2 border-accent/20 text-accent text-[10px] font-black uppercase tracking-tighter">
                                            {sub}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-slate-950/40 border-2 border-white/5 flex flex-col justify-center">
                                <p className="text-white/30 text-[9px] uppercase font-black tracking-widest mb-2">Neural Status</p>
                                <p className="text-2xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)] tracking-tighter">EXCEPTIONAL ENGAGEMENT</p>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-[92%] h-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                                    </div>
                                    <span className="text-[10px] font-black text-white/60">92%</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-10 border-white/5 relative bg-white/[0.01]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-neon/10 rounded-2xl">
                                <Bell className="w-8 h-8 text-neon" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Temporal Log</h3>
                                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">Registry of Recent Actions</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { activity: 'Logged curriculum for Advanced Maths', time: '2 HOURS AGO', icon: 'Uplink' },
                                { activity: 'Optimized Thursday Timetable', time: '1 DAY AGO', icon: 'Sync' },
                                { activity: 'Changed neural access signature', time: '3 DAYS AGO', icon: 'Shield' },
                            ].map((act, i) => (
                                <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-white/[0.02] border-2 border-white/5 hover:border-neon/20 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-2 h-2 rounded-full bg-neon shadow-[0_0_10px_#a855f7] group-hover:scale-150 transition-transform" />
                                        <span className="text-sm font-black text-white/80 uppercase tracking-tighter">{act.activity}</span>
                                    </div>
                                    <span className="text-[9px] text-white/20 font-black tracking-widest">{act.time}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Profile;
