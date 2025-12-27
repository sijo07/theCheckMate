import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllIncidentsQuery } from "../redux/api/incidentApiSlice";
import AnimatedPage from "../components/AnimatedPage";
import Navbar from "../components/Navbar";
import { PageSkeleton } from "../components/LoadingSkeleton";
import {
    Shield,
    AlertTriangle,
    TrendingUp,
    Activity,
    Filter,
    Search,
    Clock,
    MapPin,
    Zap,
} from "lucide-react";

const ThreatIntelligence = () => {
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedThreat, setSelectedThreat] = useState(null);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);

    const { data: incidents = [], isLoading, error } = useGetAllIncidentsQuery();

    // Default selection
    useEffect(() => {
        if (incidents.length > 0 && !selectedThreat) {
            setSelectedThreat(incidents[0]);
        }
    }, [incidents, selectedThreat]);

    // Filter incidents based on type and search
    const filteredIncidents = incidents.filter((incident) => {
        const matchesFilter = filter === "all" || incident.type === filter;
        const matchesSearch =
            incident.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incident.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Marquee only in "All Threads"
    const marqueeActive = filter === "all" && isAutoScrolling;

    // Get threat statistics
    const stats = {
        total: incidents.length,
        critical: incidents.filter((i) => i.type === "Ransomware" || i.type === "DDoS").length,
        active: incidents.filter((i) => {
            const hoursSinceIncident = (Date.now() - new Date(i.date).getTime()) / (1000 * 60 * 60);
            return hoursSinceIncident < 24;
        }).length,
        trending: Math.floor(incidents.length * 0.3),
    };

    const threatTypes = [
        { value: "all", label: "All Threats" },
        { value: "DDoS", label: "DDoS" },
        { value: "Phishing", label: "Phishing" },
        { value: "Malware", label: "Malware" },
        { value: "Ransomware", label: "Ransomware" },
        { value: "Unauthorized Access", label: "Unauthorized" },
    ];

    const getSeverityColor = (type) => {
        const colors = {
            DDoS: "text-red-500 bg-red-500/10 border-red-500/20",
            Phishing: "text-amber-500 bg-amber-500/10 border-amber-500/20",
            Malware: "text-red-500 bg-red-500/10 border-red-500/20",
            Ransomware: "text-red-600 bg-red-600/10 border-red-600/20",
            "Unauthorized Access": "text-orange-400 bg-orange-400/10 border-orange-400/20",
            Unknown: "text-gray-500 bg-gray-500/10 border-gray-500/20",
        };
        return colors[type] || colors.Unknown;
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    if (isLoading) return <PageSkeleton />;

    return (
        <div className="min-h-screen bg-[#050506] text-gray-100 font-mono selection:bg-red-500/30 overflow-hidden">
            {/* Top Technical Telemetry Ribbon */}
            <div className="w-full bg-red-500/10 border-b border-red-500/20 py-2 overflow-hidden whitespace-nowrap z-50 relative">
                <motion.div
                    className="inline-block text-[10px] font-bold tracking-[0.3em] text-red-500/70"
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    [ LIVE TELEMETRY: ACTIVE ] &nbsp; SYSTEM_LOAD: 24% &nbsp; [ NODE_ALPHA: ONLINE ] &nbsp; ENCRYPTION: AES_256_GCM &nbsp; [ ALERT: PACKET_ANOMALY detected in Sector 7 ] &nbsp;
                    [ LIVE TELEMETRY: ACTIVE ] &nbsp; SYSTEM_LOAD: 24% &nbsp; [ NODE_ALPHA: ONLINE ] &nbsp; ENCRYPTION: AES_256_GCM &nbsp; [ ALERT: PACKET_ANOMALY detected in Sector 7 ] &nbsp;
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                {/* Background Raster/Grid */}
                <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
                    <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
                    <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-[#050506]" />
                </div>

                <div className="relative z-10">
                    {/* Header HUD */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-5xl font-black mb-2 uppercase tracking-tighter leading-none">
                                Threat <span className="text-red-500">Intelligence</span>
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em]">
                                    Live Defense HUD // Node_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                                </p>
                            </div>
                        </motion.div>

                        {/* Search HUD */}
                        <div className="w-full md:w-96 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500/50" />
                            <input
                                type="text"
                                placeholder="IDENTIFY THREAT VECTOR..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/05 border border-white/10 rounded-xl text-white placeholder-gray-700 focus:outline-none focus:border-red-500/50 transition-all text-[10px] font-black tracking-widest uppercase"
                            />
                        </div>
                    </div>

                    {/* Stats HUD Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        {[
                            { title: "Global Threats", value: stats.total, label: "Total_Signals", icon: Shield },
                            { title: "Critical Alert", value: stats.critical, label: "Lethal_Vectors", icon: AlertTriangle, critical: true },
                            { title: "Active 24H", value: stats.active, label: "Live_Analysis", icon: Activity },
                            { title: "Trending", value: stats.trending, label: "Growth_Rate", icon: TrendingUp },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className={`p-6 bg-white/05 border border-white/10 rounded-2xl relative overflow-hidden group hover:border-${stat.critical ? 'red-500/50' : 'white/20'} transition-colors`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-5">
                                    <stat.icon size={40} />
                                </div>
                                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-3">{stat.label}</div>
                                <div className="flex items-end justify-between">
                                    <div className={`text-4xl font-black ${stat.critical ? 'text-red-500' : 'text-white'}`}>{stat.value}</div>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.critical ? 'bg-red-500/10 text-red-500' : 'bg-white/05 text-gray-500'}`}>
                                        <stat.icon size={16} />
                                    </div>
                                </div>
                                <motion.div
                                    className={`absolute bottom-0 left-0 h-[2px] ${stat.critical ? 'bg-red-500' : 'bg-white/20'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Command Center Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[650px]">

                        {/* LEFT: Cyber Scroll Filter & Feed (Col 4) */}
                        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                            <div className="flex flex-wrap gap-2 p-2 bg-white/05 border border-white/10 rounded-xl overflow-x-auto">
                                {threatTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setFilter(type.value)}
                                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === type.value
                                            ? `bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]`
                                            : "hover:bg-white/05 text-gray-500 hover:text-gray-300"
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>

                            <div
                                className="flex-1 bg-white/05 border border-white/10 rounded-2xl p-4 overflow-hidden relative group"
                                onMouseEnter={() => setIsAutoScrolling(false)}
                                onMouseLeave={() => setIsAutoScrolling(true)}
                            >
                                {/* Digital Noise/Grain Overlay */}
                                <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-20" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

                                {/* Scanning Laser focusing line */}
                                <motion.div
                                    className="absolute left-0 right-0 h-[2px] bg-red-500/40 z-30 pointer-events-none shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                    animate={{
                                        top: ["0%", "100%", "0%"]
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />

                                <div className="absolute top-4 right-4 flex items-center gap-2 z-40">
                                    <div className={`w-1.5 h-1.5 ${marqueeActive ? 'bg-red-500 animate-ping' : 'bg-gray-600'} rounded-full`} />
                                    <span className={`text-[8px] font-black ${marqueeActive ? 'text-red-500' : 'text-gray-600'} uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded backdrop-blur-md`}>
                                        {marqueeActive ? 'MARQUEE_MODE // ACTIVE' : 'MARQUEE_MODE // DISABLED'}
                                    </span>
                                </div>

                                {/* SEAMLESS MARQUEE CONTAINER */}
                                <div className={`h-full relative z-10 ${marqueeActive ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar pr-2'}`}>
                                    <motion.div
                                        className="space-y-3"
                                        animate={marqueeActive ? {
                                            y: ["0%", "-50%"],
                                        } : { y: 0 }}
                                        transition={{
                                            duration: 40,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    >
                                        {/* Render doubled list if marquee is active, single list otherwise */}
                                        {(marqueeActive ? [...filteredIncidents, ...filteredIncidents] : filteredIncidents).map((incident, index) => (
                                            <div
                                                key={`${incident._id}-${index}`}
                                                className={`p-4 border border-white/05 rounded-xl cursor-pointer transition-all ${selectedThreat?._id === incident._id
                                                    ? "bg-red-500/10 border-red-500/30"
                                                    : "bg-white/05 hover:bg-white/10"
                                                    }`}
                                                onClick={() => setSelectedThreat(incident)}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getSeverityColor(incident.type)}`}>
                                                        {incident.type}
                                                    </span>
                                                    <span className="text-[8px] font-mono text-gray-600 flex items-center gap-1">
                                                        <Clock size={8} /> {getTimeAgo(incident.date)}
                                                    </span>
                                                </div>
                                                <h3 className="text-xs font-black text-white/90 truncate uppercase tracking-tight mb-1">
                                                    {incident.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-[8px] font-bold text-gray-500">
                                                    <MapPin size={8} className="text-red-500/50" />
                                                    <span className="truncate">{incident.source.country} {" >> "} {incident.target.country}</span>
                                                </div>
                                            </div>
                                        ))}

                                        {filteredIncidents.length === 0 && (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-700 uppercase font-black text-[10px] tracking-[0.3em]">
                                                <AlertTriangle size={32} className="mb-4 opacity-20" />
                                                No_Active_Signals
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Decorative scanline mask */}
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] z-10 bg-[length:100%_4px]" />
                            </div>
                        </div>

                        {/* RIGHT: THREAT DIAGNOSTICS (Col 8) */}
                        <div className="lg:col-span-8 h-full">
                            <AnimatePresence mode="wait">
                                {selectedThreat ? (
                                    <motion.div
                                        key={selectedThreat._id}
                                        className="h-full bg-white/05 border border-white/10 rounded-2xl p-8 relative overflow-hidden overflow-y-auto custom-scrollbar"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/05 blur-[100px] pointer-events-none" />

                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                                            <div>
                                                <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                                                    <Zap size={12} fill="currentColor" />
                                                    Active_Diagnostic_Stream
                                                </div>
                                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                                    {selectedThreat.title}
                                                </h2>
                                            </div>
                                            <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 ${getSeverityColor(selectedThreat.type)}`}>
                                                <AlertTriangle size={16} />
                                                <span className="text-xs font-black uppercase tracking-widest">{selectedThreat.type} Vector</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                            <div className="space-y-6">
                                                <div className="p-4 bg-black/40 border border-white/05 rounded-xl">
                                                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">Signal_Overview</div>
                                                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                                        {selectedThreat.description}
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 bg-white/05 border border-white/05 rounded-xl">
                                                        <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Vector_Type</div>
                                                        <div className="text-xs font-black text-white">{selectedThreat.attackVector}</div>
                                                    </div>
                                                    <div className="p-4 bg-white/05 border border-white/05 rounded-xl">
                                                        <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Intelligence_Source</div>
                                                        <div className="text-xs font-black text-white uppercase">{selectedThreat.sourceType}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-red-500/05 border border-red-500/10 rounded-2xl relative">
                                                <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                    <Shield size={12} />
                                                    Mitigation_Protocol
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                                                        <div className="text-xs font-bold text-gray-400 italic">Initiate node-level isolation for Target: <span className="text-white not-italic">{selectedThreat.target.country}</span></div>
                                                    </div>
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                                                        <div className="text-xs font-bold text-gray-400 italic">Deploy AI-Filter v4.2 to block Source_IP: <span className="text-white not-italic">AUTH_REDACTED</span></div>
                                                    </div>
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                                                        <div className="text-xs font-bold text-gray-400 italic">Scrubbing traffic signature across Global_Nexus</div>
                                                    </div>
                                                </div>
                                                <div className="mt-8 pt-4 border-t border-red-500/10 flex justify-between items-center text-[9px] font-black text-red-500/50 uppercase tracking-widest">
                                                    <span>Protocol Status: READY</span>
                                                    <motion.div
                                                        className="px-4 py-1.5 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 transition-colors shadow-[0_0_15px_#ef444450]"
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        EXECUTE_RESPONSE
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Technical DNA Breakdown */}
                                        <div className="p-6 bg-white/05 border border-white/05 rounded-2xl">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-3 h-3 bg-red-500 rounded-sm rotate-45 shadow-[0_0_10px_#ef4444]" />
                                                <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">Threat_DNA_Analysis</h2>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[
                                                    { label: "Complexity", val: "LEVEL_09" },
                                                    { label: "Stability", val: "VOLATILE" },
                                                    { label: "Persistence", val: "HIGH" },
                                                    { label: "Decryption", val: "MODERATE" }
                                                ].map((trait, i) => (
                                                    <div key={i} className="p-3 bg-black/40 border border-white/05 rounded-lg text-center">
                                                        <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">{trait.label}</div>
                                                        <div className="text-[10px] font-black text-red-500">{trait.val}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center bg-white/05 border border-white/10 border-dashed rounded-2xl text-gray-700">
                                        <div className="relative mb-6">
                                            <Shield size={64} className="opacity-10" />
                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center text-red-500/20"
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                            >
                                                <Activity size={48} />
                                            </motion.div>
                                        </div>
                                        <p className="text-[10px] uppercase font-black tracking-[0.5em] text-center max-w-xs leading-relaxed">
                                            Select_threat_signal_to_initialize_deep_Packet_analysis
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreatIntelligence;
