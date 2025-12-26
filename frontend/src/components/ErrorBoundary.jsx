import { useRouteError, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCcw, ShieldAlert } from "lucide-react";

const ErrorBoundary = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono">
            {/* Background Effects */}
            <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Glitch Animated Border */}
            <motion.div
                className="relative z-10 w-full max-w-2xl card-glass border border-red-500/30 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(239,68,68,0.1)]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Decorative HUD Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
                <div className="absolute top-4 left-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/50">System Critical Error</span>
                </div>

                <div className="flex flex-col items-center text-center">
                    <motion.div
                        className="p-5 rounded-full bg-red-500/10 border border-red-500/20 mb-8"
                        animate={{
                            boxShadow: ["0 0 20px rgba(239,68,68,0.1)", "0 0 40px rgba(239,68,68,0.3)", "0 0 20px rgba(239,68,68,0.1)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <ShieldAlert className="w-16 h-16 text-red-500" />
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter leading-none">
                        Fatal <span className="text-red-500">Exception</span>
                    </h1>

                    <p className="text-gray-400 text-sm md:text-lg mb-8 max-w-md uppercase tracking-widest font-bold">
                        The security kernel encountered an unrecoverable breach in the current execution flow.
                    </p>

                    <div className="w-full bg-black/40 rounded-lg p-5 border border-white/05 mb-10 text-left overflow-hidden relative group">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-red-500/70" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Error Dump // Stack Trace Preview</span>
                        </div>
                        <code className="text-red-400/80 text-xs break-all leading-relaxed">
                            {error.statusText || error.message || "Unknown systemic failure intercepted."}
                        </code>
                        {/* Scanning visual effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-500/0 via-red-500/05 to-red-500/0 opacity-0 group-hover:opacity-100 -translate-y-[100%] group-hover:translate-y-[100%] transition-transform duration-[2000ms] pointer-events-none" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-red-500 text-white rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:bg-red-600 transition-all"
                        >
                            <RefreshCcw className="w-4 h-4 font-black" />
                            Re-Initialize Node
                        </button>
                        <Link
                            to="/"
                            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-white/05 border border-white/10 hover:border-white/30 rounded-lg font-black text-xs uppercase tracking-[0.2em] transition-all"
                        >
                            <Home className="w-4 h-4" />
                            Return to HQ
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Footer Binary Code */}
            <div className="absolute bottom-10 left-0 w-full flex justify-center opacity-10 select-none pointer-events-none">
                <p className="text-[10px] break-all max-w-4xl text-center leading-none">
                    01000101 01110010 01110010 01101111 01110010 00100000 01000100 01100101 01110100 01100101 01100011 01110100 01100101 01100100 00001010 01010011 01111001 01110011 01110100 01100101 01101101 00100000 01001000 01100001 01101100 01110100 01100101 01100100
                </p>
            </div>
        </div>
    );
};

export default ErrorBoundary;
