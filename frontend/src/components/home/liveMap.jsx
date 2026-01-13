import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Activity, Wifi, ChevronRight } from "lucide-react";

const LiveMap = () => {
    return (
        <motion.section
            className="relative w-full px-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            {/* Main Cyber Card Container */}
            <div className="relative w-full overflow-hidden rounded-3xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(220,38,38,0.05)] group">

                {/* --- Integrated Header Section --- */}
                <div className="relative px-6 py-5 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-black/40">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/20">
                            <Shield className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter text-white leading-none">
                                Live Global <span className="text-red-500">Sentinel</span>
                            </h2>
                            <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                                Real-time Attack Trace & Neutralization System
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-red-500">System_Active</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-gray-500">
                            <Wifi className="w-3 h-3" />
                            <span className="text-[9px] font-mono">UPLINK_SECURE</span>
                        </div>
                    </div>
                </div>

                {/* --- Map Viewport Area --- */}
                <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-[#050505] group-hover:bg-[#08080a] transition-colors duration-500">

                    {/* Cyber Map Background Image */}
                    <div
                        className="absolute inset-0 opacity-40 grayscale-[0.3] pointer-events-none group-hover:scale-105 transition-transform duration-[20s] ease-linear"
                        style={{
                            backgroundImage: "url('/cyber-map.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />

                    {/* Animated Overlay Grid */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                    </div>

                    {/* HUD Overlay Elements */}
                    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                        {/* Top Corners */}
                        <div className="flex justify-between">
                            <div className="w-24 h-24 border-t border-l border-red-500/30 rounded-tl-lg" />
                            <div className="w-24 h-24 border-t border-r border-red-500/30 rounded-tr-lg" />
                        </div>
                        {/* Bottom Corners */}
                        <div className="flex justify-between items-end">
                            <div className="w-24 h-24 border-b border-l border-white/10 rounded-bl-lg" />

                            {/* Floating Stats Cluster */}
                            <div className="hidden md:flex gap-6 items-end pb-2">
                                <div className="text-right">
                                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block mb-1">Active Threats</span>
                                    <span className="text-lg font-black text-white tabular-nums">2,491</span>
                                </div>
                                <div className="h-8 w-px bg-white/10" />
                                <div className="text-right">
                                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block mb-1">Defense Rate</span>
                                    <span className="text-lg font-black text-red-500 tabular-nums">99.8%</span>
                                </div>
                            </div>

                            <div className="w-24 h-24 border-b border-r border-white/10 rounded-br-lg" />
                        </div>
                    </div>

                    {/* Central UI Action - Enhanced Button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none ">
                        <motion.div
                            className="pointer-events-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/map">
                                <button className="group relative px-12 py-5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-[0.25em] transition-all clip-path-polygon shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)]">
                                    <span className="relative z-10 flex items-center gap-3">
                                        Boot Tactical Map
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    {/* Button Glitch Effect Overlay */}
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                                </button>
                            </Link>
                        </motion.div>
                        <p className="mt-4 text-[9px] text-white/50 font-mono tracking-widest uppercase animate-pulse">
                            Waiting for operator command...
                        </p>
                    </div>

                    {/* Scanning Line */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-[2px] bg-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)] z-10 pointer-events-none"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* --- Footer Status Bar --- */}
                <div className="bg-[#050505] px-6 py-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                            <Activity className="w-3 h-3 text-emerald-500" />
                            Sys_Optimal
                        </span>
                        <span className="hidden md:inline text-white/10">|</span>
                        <span className="hidden md:inline">Latency: 12ms</span>
                    </div>
                    <div className="text-[9px] font-black text-white/30 tracking-[0.3em]">
                        V.4.2.0_STABLE
                    </div>
                </div>

            </div>
        </motion.section>
    );
};

export default LiveMap;
