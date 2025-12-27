import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Terminal, Shield, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#020203] text-red-500 font-mono relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 blur-[120px]" />
        {/* Grid Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Error Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-l-4 border-red-600 pl-6 mb-12"
        >
          <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] mb-2 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>Critical_System_Error</span>
          </div>
          <h1 className="text-8xl md:text-9xl font-black text-white tracking-tighter shadow-red-500/20 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] glitch-text">
            404
          </h1>
          <div className="text-xl md:text-2xl font-bold uppercase tracking-widest text-red-500 mt-2">
            Navigation_Path_Corrupted
          </div>
        </motion.div>

        {/* Diagnostic Block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/50 border border-red-900/30 p-6 md:p-8 mb-12 backdrop-blur-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600/50 group-hover:bg-red-500 transition-colors" />
          <div className="absolute bottom-0 right-0 w-full h-[1px] bg-red-600/50 group-hover:bg-red-500 transition-colors" />

          <div className="font-mono text-xs md:text-sm text-gray-400 space-y-2 mb-6">
            <p>
              <span className="text-red-500 font-bold">{">"} ERROR_CODE:</span> 0x00_NODE_NOT_FOUND
            </p>
            <p>
              <span className="text-red-500 font-bold">{">"} TARGET_VECTOR:</span> {window.location.pathname}
            </p>
            <p>
              <span className="text-red-500 font-bold">{">"} DIAGNOSTIC:</span> The requested resource has been purged or relocated.
            </p>
          </div>

          <div className="h-2 w-full bg-red-900/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-600"
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/"
            className="flex-1 group relative px-8 py-4 bg-red-600 hover:bg-red-500 text-black font-black uppercase tracking-[0.2em] text-sm transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] flex items-center justify-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <ArrowLeft className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Return_To_Nexus</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex-1 px-8 py-4 border border-red-900/50 text-red-500 hover:bg-red-900/10 hover:border-red-500 font-bold uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3"
          >
            <Terminal className="w-5 h-5" />
            <span>Retry_Handshake</span>
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-6 flex items-center gap-2 text-[10px] text-red-900/50 font-bold uppercase tracking-widest">
        <Shield className="w-3 h-3" />
        <span>System_Integrity_Monitor: Active</span>
      </div>
    </div>
  );
};

export default NotFound;
