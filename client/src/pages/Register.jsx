import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { User, Mail, Lock, Sparkles, Shield } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', department: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('/api/auth/register', formData);
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 lg:p-12 relative overflow-hidden bg-[#030712]">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[200px] animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-3xl relative z-10"
            >
                <GlassCard className="p-16 border-neon/40 border-2 bg-slate-950/80 shadow-[0_0_100px_rgba(168,85,247,0.15)] rounded-[3.5rem] relative overflow-hidden group">
                    {/* Corner Tech Accents */}
                    <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-neon/30 rounded-tl-[3.5rem]" />
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-white/5 rounded-tr-[3.5rem]" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-white/5 rounded-bl-[3.5rem]" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-neon/30 rounded-br-[3.5rem]" />

                    <div className="absolute top-12 right-12 flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Nexus Uplink</span>
                            <span className="text-[10px] font-mono font-black text-neon shadow-[0_0_10px_#a855f7]">GEN_v9_INIT</span>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                            <Shield className="w-5 h-5 text-neon animate-pulse" />
                        </div>
                    </div>

                    <div className="mb-12 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="inline-block relative mb-6"
                        >
                            <div className="absolute inset-0 bg-neon blur-3xl opacity-20 animate-pulse" />
                            <Sparkles className="w-16 h-16 text-neon relative z-10 drop-shadow-[0_0_20px_#a855f7]" />
                        </motion.div>
                        <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Credential <span className="neon-text">Nexus</span></h1>
                        <p className="text-[11px] text-white/40 font-black uppercase tracking-[0.5em]">Initialize New Personnel Protocol</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="w-full p-6 mb-8 rounded-3xl bg-red-500/10 border-2 border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest text-center shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                        >
                            Protocol Error: {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="relative group/input md:col-span-2">
                            <label className="text-[10px] font-black text-neon uppercase tracking-[0.4em] ml-6 mb-3 block opacity-40 group-focus-within/input:opacity-100 transition-all">Identity Designation</label>
                            <div className="relative">
                                <User className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10 group-focus-within/input:text-neon transition-all" />
                                <input
                                    type="text"
                                    placeholder="LEGAL_NAME_ASSET"
                                    required
                                    className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] py-6 pl-20 pr-8 text-white font-black text-lg outline-none focus:border-neon/50 focus:bg-neon/5 transition-all shadow-2xl placeholder:text-white/5"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="relative group/input md:col-span-2">
                            <label className="text-[10px] font-black text-neon uppercase tracking-[0.4em] ml-6 mb-3 block opacity-40 group-focus-within/input:opacity-100 transition-all">Communication Vector</label>
                            <div className="relative">
                                <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10 group-focus-within/input:text-neon transition-all" />
                                <input
                                    type="email"
                                    placeholder="ASSET@SYSTEM.CORE"
                                    required
                                    className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] py-6 pl-20 pr-8 text-white font-black text-lg outline-none focus:border-neon/50 focus:bg-neon/5 transition-all shadow-2xl placeholder:text-white/5"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="relative group/input">
                            <label className="text-[10px] font-black text-neon uppercase tracking-[0.4em] ml-6 mb-3 block opacity-40 group-focus-within/input:opacity-100 transition-all">Security Phasing</label>
                            <div className="relative">
                                <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10 group-focus-within/input:text-neon transition-all" />
                                <input
                                    type="password"
                                    placeholder="ENCRYPT_KEY"
                                    required
                                    className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] py-6 pl-20 pr-8 text-white font-black text-lg outline-none focus:border-neon/50 focus:bg-neon/5 transition-all shadow-2xl placeholder:text-white/5"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="relative group/input">
                            <label className="text-[10px] font-black text-neon uppercase tracking-[0.4em] ml-6 mb-3 block opacity-40 group-focus-within/input:opacity-100 transition-all">Node Hierarchy</label>
                            <div className="relative">
                                <Shield className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10 group-focus-within/input:text-neon transition-all" />
                                <select
                                    className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] py-6 pl-20 pr-8 text-white font-black text-lg outline-none focus:border-neon/50 focus:bg-neon/5 transition-all shadow-2xl appearance-none cursor-pointer"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="student" className="bg-slate-900">Personnel: Student</option>
                                    <option value="teacher" className="bg-slate-900">Personnel: Teacher</option>
                                    <option value="admin" className="bg-slate-900">Personnel: Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button type="submit" className="neon-button w-full py-7 font-black text-sm uppercase tracking-[0.5em] group/btn">
                                <span className="relative z-10 transition-all group-hover/btn:scale-105 inline-block">Initialize Genesis</span>
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 text-center border-t-2 border-white/5 pt-10 relative z-10">
                        <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.3em]">
                            Existing Signature?
                            <Link to="/login" className="text-neon hover:text-white transition-all ml-4 border-b-2 border-neon/20 hover:border-white px-2 py-1">
                                Re-Establish Link
                            </Link>
                        </p>
                    </div>

                    {/* Scanning Line Global Effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[3.5rem]">
                        <motion.div
                            animate={{ top: ['-10%', '110%'] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-neon/5 shadow-[0_0_20px_#a855f7] z-0"
                        />
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default Register;
