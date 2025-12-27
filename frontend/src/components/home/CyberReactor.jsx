import React from "react";
import { motion } from "framer-motion";

const CyberReactor = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-radial-gradient from-red-900/20 via-black to-black opacity-50" />

            {/* Core Reactor Ring - Fast Spin */}
            <motion.div
                className="absolute w-[60%] h-[60%] border-[2px] border-red-500/30 rounded-full border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Counter-Rotating Tech Ring */}
            <motion.div
                className="absolute w-[75%] h-[75%] border-[1px] border-red-500/20 rounded-full"
                style={{ borderTopColor: "transparent", borderBottomColor: "transparent" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Pulsing Core */}
            <motion.div
                className="absolute w-[30%] h-[30%] bg-red-600/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Inner Solid Core */}
            <div className="absolute w-[15%] h-[15%] bg-red-500 rounded-full shadow-[0_0_50px_#ef4444]" />

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-red-400 rounded-full"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{
                        x: (Math.random() - 0.5) * 200,
                        y: (Math.random() - 0.5) * 200,
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                />
            ))}

            {/* Hexagon Overlay Grid (Simulated) */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle, #ef4444 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />
        </div>
    );
};

export default CyberReactor;
