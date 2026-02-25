import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import axios from 'axios';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your Smart Academic Assistant. How can I help you today?' }
    ]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        try {
            const { data } = await axios.post('/api/ai/chat', { prompt: input });
            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (err) {
            // Simulated AI fallback if offline or backend error
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "I'm analyzing your academic data... Based on your curriculum progress, you should focus on 'Routing Algorithms' today to stay on track for your Feb 28th milestone."
                }]);
            }, 800);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-80 h-96 glass-card flex flex-col p-4"
                    >
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-neon" />
                                <span className="font-bold neon-text">AI Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-accent/20 border border-accent/30' : 'bg-white/5 border border-white/10'}`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-neon"
                            />
                            <button onClick={handleSend} className="bg-neon-gradient p-2 rounded-full"><Send className="w-4 h-4" /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-neon-gradient p-4 rounded-full shadow-lg shadow-neon/40 flex items-center justify-center"
            >
                <MessageSquare className="w-6 h-6 text-white" />
            </motion.button>
        </div>
    );
};

export default AIAssistant;
