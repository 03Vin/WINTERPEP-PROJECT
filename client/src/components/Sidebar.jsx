import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, BookOpen, UserCircle, LogOut, Sparkles, ClipboardCheck, Library } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const links = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/timetable', icon: Calendar, label: 'Schedule' },
        { to: '/curriculum', icon: BookOpen, label: 'Curriculum' },
        { to: '/resources', icon: Library, label: 'Library' },
        ...(user?.role === 'teacher' || user?.role === 'admin' ? [{ to: '/attendance', icon: ClipboardCheck, label: 'Attendance' }] : []),
        { to: '/profile', icon: UserCircle, label: 'Profile' },
    ];

    return (
        <div className="w-64 h-screen bg-slate-900/40 backdrop-blur-2xl border-r border-white/10 sticky top-0 flex flex-col z-[100]">
            <div className="p-8 mb-4">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-2 bg-neon/10 rounded-xl group-hover:bg-neon/20 transition-all">
                        <Sparkles className="w-8 h-8 text-neon animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black neon-text tracking-tighter uppercase line-height-none">SmartAcad</h1>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-ping" />
                            <span className="text-[8px] font-black text-neon/60 uppercase tracking-widest">System Online</span>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `
              flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 relative group
              ${isActive ? 'bg-neon/10 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'text-white/40 hover:text-white hover:bg-white/5'}
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-neon' : ''}`} />
                                <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>{link.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 w-1 h-8 bg-neon rounded-r-full shadow-[0_0_15px_#a855f7]"
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-neon-gradient flex items-center justify-center text-white font-black uppercase shadow-lg shadow-neon/20">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-black text-white truncate">{user?.name}</p>
                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl w-full hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-red-500/20"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
