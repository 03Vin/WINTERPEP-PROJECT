import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    X, FileText, Video, ExternalLink, Sparkles,
    Download, PlayCircle, BookOpen, AlertCircle,
    ArrowRight
} from 'lucide-react';
import GlassCard from './GlassCard';

const ResourceDrawer = ({ isOpen, onClose, subject }) => {
    const [resources, setResources] = useState({ documents: [], videos: [], external: [] });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && subject) {
            fetchResources();
        }
    }, [isOpen, subject]);

    const fetchResources = async () => {
        setIsLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            // Handle both subject object and ID-only calls
            const subId = subject.name ? subject.name.split(' : ')[0].split(' ')[0] : subject;

            const res = await axios.get(`http://localhost:5000/api/resources/${subId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const raw = res.data;
            setResources({
                documents: raw.filter(r => r.type === 'PDF'),
                videos: raw.filter(r => r.type === 'Video'),
                external: raw.filter(r => r.type === 'Link')
            });
        } catch (err) {
            console.error("Fetch Resources Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!subject) return null;

    // AI logic: Recommend based on pending topics
    const pendingTopics = subject.topics?.filter(t => !t.completed) || [];

    // Pick the "best" resource for the first pending topic
    const recommendedResource = pendingTopics.length > 0
        ? [...resources.videos, ...resources.documents, ...resources.external].find(r => r.topics.includes(pendingTopics[0].id.toString()))
        : null;

    // Fallback recommendation if no topic match
    const finalRec = recommendedResource || resources.videos[0] || resources.documents[0];

    const handleAction = (type, title, url) => {
        if (url) {
            window.open(url, '_blank');
        } else {
            alert(`${type}: ${title}\n\nSimulation: Assets are being synchronized from AIvent Cloud...`);
        }
    };

    // Filtered lists to avoid "same item twice" - URL comparison is 100% reliable for deduplication
    const displayVideos = resources.videos.filter(v => v.url !== finalRec?.url);
    const displayDocs = resources.documents.filter(d => d.url !== finalRec?.url);
    const displayExt = resources.external.filter(e => e.url !== finalRec?.url);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0f1d] border-l border-white/5 z-[60] shadow-2xl overflow-y-auto custom-scrollbar"
                    >
                        <div className="p-8 space-y-8">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-neon text-[10px] font-black uppercase tracking-widest">
                                        <BookOpen className="w-3 h-3" />
                                        Resource Center
                                    </div>
                                    <h2 className="text-xl font-black text-white pr-4">{subject.name}</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/40" />
                                </button>
                            </div>

                            {/* AI Recommendations */}
                            {finalRec && pendingTopics.length > 0 && (
                                <GlassCard className="p-5 border-neon/20 bg-neon/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                                        <Sparkles className="w-12 h-12 text-neon" />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-neon" />
                                            <h3 className="text-xs font-black uppercase tracking-widest">AI Recommendations</h3>
                                        </div>
                                        <p className="text-xs text-white/60 font-medium leading-relaxed">
                                            You haven't finished <span className="text-neon">"{pendingTopics[0].title}"</span> yet. We recommend starting with <span className="text-white italic">"{finalRec.title}"</span> {finalRec.provider ? `by ${finalRec.provider}` : ''}.
                                        </p>
                                        <button
                                            onClick={() => handleAction('Stream', 'Recommended Detail', finalRec.url)}
                                            className="w-full py-2.5 rounded-xl bg-neon text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg shadow-neon/20"
                                        >
                                            <PlayCircle className="w-3 h-3" />
                                            {finalRec.type === 'Video' ? 'Watch' : 'Read'} Recommendation
                                        </button>
                                    </div>
                                </GlassCard>
                            )}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="w-12 h-12 border-4 border-neon/20 border-t-neon rounded-full animate-spin"></div>
                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Fetching Academic Assets...</p>
                                </div>
                            )}

                            {/* Resource Sections */}
                            {!isLoading && (
                                <div className="space-y-8">
                                    {/* Documents */}
                                    {displayDocs.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <FileText className="w-3 h-3" />
                                                Lecture Notes & PDFs
                                            </h4>
                                            <div className="space-y-2">
                                                {displayDocs.map((doc, i) => (
                                                    <div
                                                        key={i}
                                                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all flex justify-between items-center group cursor-pointer"
                                                        onClick={() => handleAction('Download', doc.title, doc.url)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                                <FileText className="w-4 h-4 text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white/90">{doc.title}</p>
                                                                <p className="text-[10px] text-white/30 truncate max-w-[200px]">
                                                                    {doc.type} • {doc.size} {doc.provider ? `• by ${doc.provider}` : ''}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Download className="w-4 h-4 text-white/10 group-hover:text-neon transition-colors" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Videos */}
                                    {displayVideos.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Video className="w-3 h-3" />
                                                Video Tutorials
                                            </h4>
                                            <div className="space-y-2">
                                                {displayVideos.map((vid, i) => (
                                                    <div
                                                        key={i}
                                                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all flex justify-between items-center group cursor-pointer"
                                                        onClick={() => handleAction('Play', vid.title, vid.url)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                                <Video className="w-4 h-4 text-purple-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white/90">{vid.title}</p>
                                                                <p className="text-[10px] text-white/30 truncate max-w-[200px]">
                                                                    {vid.size} {vid.provider ? `• by ${vid.provider}` : ''}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <PlayCircle className="w-4 h-4 text-white/10 group-hover:text-accent transition-colors" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* External */}
                                    {displayExt.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <ExternalLink className="w-3 h-3" />
                                                External References
                                            </h4>
                                            <div className="space-y-2">
                                                {displayExt.map((ext, i) => (
                                                    <div
                                                        key={i}
                                                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all flex justify-between items-center group cursor-pointer"
                                                        onClick={() => handleAction('Launch', ext.title, ext.url)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-0.5 h-6 bg-accent/30 rounded-full" />
                                                            <div>
                                                                <p className="text-sm font-bold text-white/90">{ext.title}</p>
                                                                <p className="text-[10px] text-accent/60 font-mono truncate max-w-[200px]">
                                                                    {ext.provider ? `Ref: ${ext.provider} • ` : ''}{ext.url}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 text-white/10 group-hover:text-accent transition-colors" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Footer Call Action */}
                            <div className="pt-8 mt-8 border-t border-white/5">
                                <button className="w-full flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-neon/10 transition-colors">
                                            <AlertCircle className="w-5 h-5 text-white/20 group-hover:text-neon" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-white/80">Issue with resources?</p>
                                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Report broken link</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/10 group-hover:translate-x-1 transition-all" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ResourceDrawer;
