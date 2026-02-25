import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, ShieldCheck, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const QRScanner = ({ onScanSuccess, onScanError, onClose }) => {
    const scannerRef = useRef(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 15,
                qrbox: { width: 300, height: 300 },
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true
            },
            /* verbose= */ false
        );

        scanner.render((decodedText) => {
            try {
                const data = JSON.parse(decodedText);
                onScanSuccess(data.token || decodedText, data.sessionId);
            } catch (e) {
                onScanSuccess(decodedText);
            }
            scanner.clear();
        }, onScanError);

        return () => {
            scanner.clear().catch(err => console.error("Scanner Cleanup Error:", err));
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#030712]/95 backdrop-blur-2xl">
            {/* Ambient Cyber Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon/10 rounded-full blur-[180px] animate-pulse" />
                <div className="absolute inset-0 opacity-[0.03] animate-hologram bg-[url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100 100H0V0h100v100zM1 99h98V1H1v98z' fill='%23ffffff'/%3E%3C/svg%3E')]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xl relative"
            >
                <div className="bg-slate-950/80 border-2 border-neon/40 rounded-[3.5rem] p-12 relative overflow-hidden shadow-[0_0_150px_rgba(168,85,247,0.2)]">
                    {/* Corner Tech Accents */}
                    <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-neon/30 rounded-tl-[3.5rem]" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-neon/30 rounded-br-[3.5rem]" />

                    <div className="flex justify-between items-start mb-12 relative z-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-neon/10 rounded-2xl border border-neon/30">
                                    <ShieldCheck className="w-6 h-6 text-neon animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Optical Uplink</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-2 h-2 rounded-full bg-neon animate-ping" />
                                        <span className="text-[10px] text-neon font-black uppercase tracking-[0.4em]">Ready for Verification</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white border border-white/5 active:scale-90"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="relative group">
                        {/* Interactive Frame */}
                        <div className="absolute -inset-4 border-2 border-neon/10 rounded-[2.5rem] pointer-events-none group-hover:border-neon/20 transition-all duration-700" />

                        <div
                            id="qr-reader"
                            className="rounded-[2rem] overflow-hidden border-2 border-white/10 bg-black shadow-2xl aspect-square relative"
                        >
                            {/* Scanning Overlays will be injected here by the library, but we add our own visual flair */}
                            <div className="absolute inset-0 z-30 pointer-events-none border-[20px] border-slate-950/60" />
                        </div>

                        {/* Premium Frame Corner Accents */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 border-t-4 border-l-4 border-neon rounded-tl-2xl shadow-[-5px_-5px_20px_rgba(168,85,247,0.4)]" />
                        <div className="absolute -top-6 -right-6 w-12 h-12 border-t-4 border-r-4 border-neon rounded-tr-2xl shadow-[5px_-5px_20px_rgba(168,85,247,0.4)]" />
                        <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-4 border-l-4 border-neon rounded-bl-2xl shadow-[-5px_5px_20px_rgba(168,85,247,0.4)]" />
                        <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-4 border-r-4 border-neon rounded-br-2xl shadow-[5px_5px_20px_rgba(168,85,247,0.4)]" />

                        {/* Animated Scanning Line */}
                        <motion.div
                            animate={{ top: ['10%', '90%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-4 right-4 h-1 bg-neon shadow-[0_0_20px_#a855f7] z-40 pointer-events-none opacity-60"
                        />
                    </div>

                    <div className="mt-12 flex flex-col items-center gap-6">
                        <div className="w-full p-6 bg-slate-900/60 border-2 border-white/5 rounded-3xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <QrCode className="w-6 h-6 text-white/20" />
                                <span className="text-[11px] text-white/40 font-black uppercase tracking-[0.3em]">Scanner Status</span>
                            </div>
                            <span className="text-xs font-mono font-black text-neon tracking-widest">ENCRYPTED_LINK_ACTIVE</span>
                        </div>

                        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] text-center leading-relaxed max-w-xs">
                            Position the holographic token within the focal point for identity verification.
                        </p>
                    </div>
                </div>

                {/* Decorative Bottom Tech Bar */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-neon/20 blur-2xl rounded-full opacity-50" />
            </motion.div>
        </div>
    );
};

export default QRScanner;
