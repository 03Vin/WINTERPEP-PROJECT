import React from 'react';
import Sidebar from './Sidebar';
import AIAssistant from './AIAssistant';

const Layout = ({ children }) => {
    return (
        <div className="flex bg-slate-950 min-h-screen relative overflow-hidden">
            {/* Global Animated Background System */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-neon/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <Sidebar />

            <main className="flex-1 p-8 relative z-10">
                <div className="max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
                <AIAssistant />
            </main>
        </div>
    );
};

export default Layout;
