import React from 'react';
import GlassCard from './GlassCard';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen } from 'lucide-react';

const CurriculumSummary = ({ subjects, className = "" }) => {
    const calculateProgress = (topics) => {
        if (!topics || topics.length === 0) return 0;
        const completed = topics.filter(t => t.completed).length;
        return Math.round((completed / topics.length) * 100);
    };

    return (
        <GlassCard className={`flex flex-col gap-6 ${className}`}>
            <div className="flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2 text-xl">
                    <BookOpen className="w-5 h-5 text-neon" />
                    Curriculum Progress
                </h3>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">AI Tracking Enabled</span>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {subjects.map((sub, i) => {
                    const progress = calculateProgress(sub.topics);
                    return (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-white/90 uppercase tracking-tight truncate max-w-[200px]">
                                        {sub.name}
                                    </p>
                                    <div className="flex items-center gap-2 text-[8px] text-white/40">
                                        <Sparkles className="w-2 h-2 text-neon" />
                                        Forecast: {sub.forecast}
                                    </div>
                                </div>
                                <span className="text-xs font-black neon-text">{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-neon-gradient"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
};

export default CurriculumSummary;
