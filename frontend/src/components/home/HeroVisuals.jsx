import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import CyberReactor from "./CyberReactor";

const HeroVisuals = () => {
    return (
        <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
        >
            {/* Main Circular Image Container */}
            <div className="relative z-20 w-full max-w-[500px] aspect-square rounded-full overflow-hidden border-2 border-red-500/20 shadow-[0_0_80px_rgba(239,68,68,0.2)] bg-black">
                <CyberReactor />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-transparent opacity-60" />
            </div>

            {/* CYBER RINGS INFRASTRUCTURE - Positioned outside the circle for visibility */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none z-10 flex items-center justify-center">

                {/* Outer Pulsing Glow */}
                <motion.div
                    className="absolute inset-0 border border-red-500/10 rounded-full"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Vibrant Conic Sweep - Multiple segments */}
                <motion.div
                    className="absolute inset-[-5%] rounded-full opacity-60"
                    style={{
                        background: 'conic-gradient(from 0deg, transparent 0deg, #ef4444 10deg, transparent 40deg, transparent 180deg, #ef4444 190deg, transparent 220deg)',
                        maskImage: 'radial-gradient(transparent 68%, black 70%)',
                        WebkitMaskImage: 'radial-gradient(transparent 68%, black 70%)'
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* High-Speed Glitch Tech Ring */}
                <motion.div
                    className="absolute inset-[2%] border border-red-500/40 rounded-full"
                    animate={{
                        rotate: -360,
                        opacity: [0.1, 0.4, 0.2, 0.6, 0.1],
                        scale: [1, 1.01, 0.99, 1]
                    }}
                    transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 0.1, repeat: Infinity, repeatType: "mirror" }
                    }}
                />

                {/* Tactical Nav Markers */}
                {[0, 90, 180, 270].map((angle) => (
                    <div
                        key={angle}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
                        style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
                    >
                        <motion.div
                            className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0.5 h-4 bg-red-500 shadow-[0_0_10px_#ef4444]"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity, delay: angle / 90 * 0.5 }}
                        />
                    </div>
                ))}
            </div>

            {/* Floating UI HUD elements - Centered Diagnostic Panel */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-[280px] md:w-80 p-5 md:p-6 bg-black/90 backdrop-blur-xl border border-red-500/30 z-30 shadow-[0_0_50px_rgba(239,68,68,0.15)] group overflow-hidden"
                style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)"
                }}
                initial={{ x: "-50%", y: "-50%" }}
            >
                {/* Background Grid Texture */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(239,68,68,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Scanning Laser Line */}
                <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px] bg-red-500/50 z-10 shadow-[0_0_10px_#ef4444]"
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500 z-20" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500 z-20" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500 z-20" />
                {/* Cut corner bracket handled by clip-path, but visual border needed */}
                <div className="absolute bottom-[0px] right-[25px] w-[calc(100%-25px)] h-[1px] bg-red-500/30 z-20" />
                <div className="absolute bottom-[0px] right-0 w-[2px] h-[15%] bg-red-500/30 z-20 origin-bottom skew-x-[-45deg]" />

                <div className="relative z-20">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-red-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">System Status</span>
                        </div>
                        <span className="text-[9px] font-mono text-red-500 animate-pulse">LIVE</span>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute opacity-75" />
                            <div className="w-3 h-3 bg-green-500 rounded-full relative shadow-[0_0_10px_#22c55e]" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Core Integrity</span>
                            <span className="block text-sm font-black uppercase tracking-widest text-white">Stable</span>
                        </div>
                    </div>

                    {/* Dynamic Load Bars */}
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase">
                                <span>Neural Net</span>
                                <span className="text-red-400">89%</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-red-600 shadow-[0_0_10px_#dc2626]"
                                    initial={{ width: "40%" }}
                                    animate={{ width: ["40%", "89%", "65%", "89%"] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase">
                                <span>Encryption</span>
                                <span className="text-red-400">100%</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-red-500 shadow-[0_0_10px_#ef4444]"
                                    animate={{ width: "100%" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Data */}
                    <div className="mt-4 pt-2 border-t border-white/10 flex justify-between text-[8px] font-mono text-gray-500">
                        <span>ID: 8X-992</span>
                        <span>LOC: 127.0.0.1</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default HeroVisuals;
