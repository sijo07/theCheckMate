import { useRouteError, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Home, RefreshCcw, ShieldAlert, Terminal, Cpu, Lock, AlertOctagon } from "lucide-react";

const HexDump = () => {
    const [hexLines, setHexLines] = useState([]);

    useEffect(() => {
        const generateLine = () => {
            const addr = `0x${Math.floor(Math.random() * 65535).toString(16).padStart(4, '0').toUpperCase()}`;
            const bytes = Array.from({ length: 8 }, () => Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase()).join(" ");
            return `${addr}  ${bytes}`;
        };

        // Fill initial
        setHexLines(Array.from({ length: 20 }, generateLine));

        const interval = setInterval(() => {
            setHexLines(prev => [...prev.slice(1), generateLine()]);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-mono text-[10px] text-red-900/50 pointer-events-none select-none overflow-hidden h-full flex flex-col justify-end">
            {hexLines.map((line, i) => (
                <div key={i} className="whitespace-pre">{line}</div>
            ))}
        </div>
    );
};

const ErrorBoundary = () => {
    const error = useRouteError();
    const navigate = useNavigate();
    const [isRestoring, setIsRestoring] = useState(false);
    const [restoreProgress, setRestoreProgress] = useState(0);

    const handleReload = () => {
        setIsRestoring(true);
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 10;
            if (p > 100) {
                p = 100;
                clearInterval(interval);
                window.location.reload();
            }
            setRestoreProgress(p);
        }, 100);
    };

    return (
        <div className="min-h-screen bg-black text-red-600 font-mono relative overflow-hidden flex items-center justify-center p-4">
            {/* CRT Lines */}
            <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />

            {/* Background Hex Dump */}
            <div className="absolute inset-0 opacity-20">
                <HexDump />
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 border border-red-900 bg-black/95 shadow-[0_0_100px_rgba(220,38,38,0.2)]">

                {/* Left Panel: Graphic Error */}
                <div className="p-12 flex flex-col justify-between border-r border-red-900/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-pulse" />

                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <ShieldAlert className="w-12 h-12 text-red-600 animate-pulse" />
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-red-900">System_Check_Failure</h2>
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-red-500">Critical_Stop</h2>
                            </div>
                        </div>

                        <motion.h1
                            className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4 text-white mix-blend-difference"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0 }}
                        >
                            Kernel<br />
                            <span className="text-red-600 text-outline-red">Panic</span>
                        </motion.h1>

                        <div className="inline-block px-4 py-2 bg-red-600 text-black font-black text-xs uppercase tracking-widest mb-8">
                            Error_Code: 0x{Math.floor(Math.random() * 99999).toString(16).toUpperCase()}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                            The execution thread was terminated to prevent system compromise.
                        </p>
                        <div className="text-[10px] text-red-900 font-mono border border-red-900/30 p-4 bg-red-950/10">
                            {error?.statusText || error?.message || "Unknown Exception Intercepted"}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Interactive Terminal */}
                <div className="p-12 bg-[#050505] flex flex-col relative text-xs">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                        <div className="w-3 h-3 rounded-full bg-red-900" />
                        <div className="w-3 h-3 rounded-full bg-red-900" />
                    </div>

                    <div className="flex-1 font-mono text-gray-500 mb-8 space-y-2 overflow-hidden">
                        <p className="text-red-500">{">"} RUNNING DIAGNOSTICS...</p>
                        <p>{">"} MEMORY_DUMP... [DONE]</p>
                        <p>{">"} STACK_TRACE_ANALYSIS... [FAIL]</p>
                        <p>{">"} ATTEMPTING_SYSCALL_HOOK... [FAIL]</p>
                        <p className="text-red-500 animate-pulse">{">"} FATAL: UNRECOVERABLE_STATE</p>
                        <p className="mt-4 text-gray-600">
                            A problem has been detected and windows has been shut down to prevent damage to your computer.
                            If this is the first time you've seen this stop error screen, restart your computer.
                        </p>
                    </div>

                    {isRestoring ? (
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase text-red-500 animate-pulse">
                                <span>System_Restore_Protocol</span>
                                <span>{Math.round(restoreProgress)}%</span>
                            </div>
                            <div className="w-full h-2 bg-red-900/30">
                                <motion.div
                                    className="h-full bg-red-600"
                                    style={{ width: `${restoreProgress}%` }}
                                />
                            </div>
                            <div className="text-[10px] text-gray-600 text-center pt-2">
                                DO NOT TURN OFF POWER
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleReload}
                                className="group py-4 border border-red-600/30 bg-red-600/10 hover:bg-red-600 hover:text-black transition-all flex flex-col items-center justify-center gap-2"
                            >
                                <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                <span className="font-black uppercase tracking-widest text-[10px]">Re-Initialize</span>
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="group py-4 border border-gray-800 bg-gray-900/50 hover:bg-white hover:text-black hover:border-white transition-all flex flex-col items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                <span className="font-black uppercase tracking-widest text-[10px]">Safe_Mode_Boot</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundary;
