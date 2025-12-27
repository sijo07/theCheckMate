import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LiveMap = () => {
    return (
        <motion.section
            className="relative w-full max-w-6xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#09090b] border border-white/10 shadow-[0_0_100px_rgba(239,68,68,0.05)] group">
                {/* Cyber Map Background Image */}
                <div
                    className="absolute inset-0 opacity-40 grayscale-[0.5] pointer-events-none"
                    style={{
                        backgroundImage: "url('/cyber-map.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />

                {/* Animated Background Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                {/* Tactical Radar Ring */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        className="w-[80%] h-[80%] border border-red-500/10 rounded-full"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute w-[50%] h-[50%] border border-red-500/05 rounded-full"
                        animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.05, 0.15, 0.05] }}
                        transition={{ duration: 6, repeat: Infinity }}
                    />

                    {/* Radar Sweep */}
                    <motion.div
                        className="absolute w-full h-full bg-gradient-to-tr from-red-500/10 via-transparent to-transparent opacity-20"
                        style={{ transformOrigin: 'center', clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Crosshair Elements */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-px bg-red-500/40" />
                    <div className="h-20 w-px bg-red-500/40" />
                    <div className="absolute border border-red-500/30 w-12 h-12 rounded-sm" />
                </div>

                {/* Data Corner Readouts */}
                <div className="absolute top-8 left-8 text-left space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Operational_Node: ALPHA-01</span>
                    </div>
                    <div className="text-[10px] font-mono text-gray-600 space-y-1">
                        <p>LAT: 40.7128 N</p>
                        <p>LNG: 74.0060 W</p>
                        <p className="text-red-500/50 italic">SCAN_MODE: ACTIVE</p>
                    </div>
                </div>

                <div className="absolute top-8 right-8 text-right space-y-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Transmission Status</span>
                    <div className="flex gap-1.5 justify-end">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1 h-3 bg-red-500/20 rounded-full"
                                animate={{ height: [4, 12, 4], backgroundColor: ['rgba(239,68,68,0.2)', 'rgba(239,68,68,0.8)', 'rgba(239,68,68,0.2)'] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </div>
                </div>

                {/* Central UI Hub */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/20 backdrop-blur-[1px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.6em] mb-4 block">Tactical Visualization Overlay</span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                            Global <span className="text-red-500">Sentinel</span> Core
                        </h1>

                        {/* Tactical Info Cards */}
                        <div className="flex flex-wrap justify-center gap-6 mb-8">
                            {[
                                { label: "Active Nodes", val: "14,802", color: "text-blue-400" },
                                { label: "Threat Density", val: "CRITICAL", color: "text-red-500" },
                                { label: "System Sync", val: "99.9%", color: "text-green-500" }
                            ].map((stat, i) => (
                                <div key={i} className="px-6 py-3 bg-[#111112]/80 border border-white/05 rounded-lg flex flex-col items-center min-w-[140px]">
                                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">{stat.label}</span>
                                    <span className={`text-sm font-black uppercase tracking-widest ${stat.color}`}>{stat.val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Initialize Button */}
                        <Link to="/map">
                            <motion.button
                                className="group relative px-10 py-4 bg-red-500 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.3em] overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                                <span className="relative z-10 flex items-center gap-3">
                                    Boot Tactical Map
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </span>
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                {/* Global Coordinates Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-10 border-t border-white/05 bg-[#111112]/90 flex items-center justify-between px-8 text-[8px] font-black text-gray-700 tracking-[0.4em] uppercase">
                    <span>Targeting System: ONLINE</span>
                    <div className="hidden md:flex gap-4">
                        <span className="text-red-500/40">LON_E 120.44.11</span>
                        <span className="text-red-500/40">LAT_S 32.11.02</span>
                    </div>
                    <span>PROTO_SENTINEL_V4.0</span>
                </div>

                {/* Scanning Line Effect */}
                <motion.div
                    className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-red-500/40 to-transparent pointer-events-none"
                    animate={{ left: ['-5%', '105%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </motion.section>
    );
};

export default LiveMap;
