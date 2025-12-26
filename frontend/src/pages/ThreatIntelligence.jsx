import { useState, useEffect } from "react";
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

    const { data: incidents = [], isLoading, error } = useGetAllIncidentsQuery();

    // Filter incidents based on type and search
    const filteredIncidents = incidents.filter((incident) => {
        const matchesFilter = filter === "all" || incident.type === filter;
        const matchesSearch =
            incident.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incident.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

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
        { value: "all", label: "All Threats", color: "from-blue-500 to-indigo-600" },
        { value: "DDoS", label: "DDoS", color: "from-red-500 to-pink-600" },
        { value: "Phishing", label: "Phishing", color: "from-yellow-500 to-red-400" },
        { value: "Malware", label: "Malware", color: "from-purple-500 to-pink-600" },
        { value: "Ransomware", label: "Ransomware", color: "from-red-600 to-red-800" },
        { value: "Unauthorized Access", label: "Unauthorized", color: "from-red-400 to-red-600" },
    ];

    const getSeverityColor = (type) => {
        const colors = {
            DDoS: "text-red-500 bg-red-500/10 border-red-500/05",
            Phishing: "text-yellow-500 bg-yellow-500/10 border-yellow-500/05",
            Malware: "text-red-500 bg-red-500/10 border-red-500/05",
            Ransomware: "text-red-600 bg-red-600/10 border-red-600/05",
            "Unauthorized Access": "text-red-400 bg-red-400/10 border-red-400/05",
            Unknown: "text-gray-500 bg-gray-500/10 border-gray-500/05",
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
        <AnimatedPage variant="fadeIn">
            <div className="min-h-screen bg-[#111112] text-white font-mono">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">
                            Threat <span className="text-red-500">Intelligence</span>
                        </h1>
                        <p className="text-gray-400">
                            Real-time threat monitoring and AI-powered insights
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            {
                                title: "Total Threats",
                                value: stats.total,
                                icon: <Shield className="w-6 h-6" />,
                                gradient: "from-blue-500 to-indigo-600",
                            },
                            {
                                title: "Critical",
                                value: stats.critical,
                                icon: <AlertTriangle className="w-6 h-6" />,
                                gradient: "from-red-500 to-pink-600",
                            },
                            {
                                title: "Active (24h)",
                                value: stats.active,
                                icon: <Activity className="w-6 h-6" />,
                                gradient: "from-green-500 to-emerald-600",
                            },
                            {
                                title: "Trending",
                                value: stats.trending,
                                icon: <TrendingUp className="w-6 h-6" />,
                                gradient: "from-red-400 to-red-600",
                            },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="card-glass rounded-xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                                        <p className="text-3xl font-black">{stat.value}</p>
                                    </div>
                                    <div
                                        className={`p-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20`}
                                    >
                                        {stat.icon}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Filters and Search */}
                    <div className="glass-dark rounded-xl p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                                <input
                                    type="text"
                                    placeholder="SEARCH THREATS..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-[#111112] border border-white/05 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-all text-xs font-bold tracking-widest"
                                />
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {threatTypes.map((type) => (
                                    <motion.button
                                        key={type.value}
                                        onClick={() => setFilter(type.value)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === type.value
                                            ? `bg-red-500 text-white shadow-lg`
                                            : "bg-[#111112] border border-white/05 text-gray-500 hover:text-white"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {type.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Threat Feed */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Threat List */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                Live Threat Feed
                            </h2>

                            <AnimatePresence mode="popLayout">
                                {filteredIncidents.length === 0 ? (
                                    <motion.div
                                        className="glass-dark rounded-xl p-12 text-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <AlertTriangle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                        <p className="text-gray-400">No threats found</p>
                                    </motion.div>
                                ) : (
                                    filteredIncidents.map((incident, index) => (
                                        <motion.div
                                            key={incident._id}
                                            className={`card-glass rounded-xl p-6 cursor-pointer ${selectedThreat?._id === incident._id
                                                ? "ring-1 ring-red-500/50"
                                                : ""
                                                }`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => setSelectedThreat(incident)}
                                            layout
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                                                                incident.type
                                                            )}`}
                                                        >
                                                            {incident.type}
                                                        </span>
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {getTimeAgo(incident.date)}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold mb-2">
                                                        {incident.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm line-clamp-2">
                                                        {incident.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{incident.source.country}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span>→</span>
                                                    <span>{incident.target.country}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Threat Details Panel */}
                        <div className="lg:col-span-1">
                            <h2 className="text-xl font-semibold mb-4">Threat Details</h2>
                            <AnimatePresence mode="wait">
                                {selectedThreat ? (
                                    <motion.div
                                        key={selectedThreat._id}
                                        className="glass-dark rounded-xl p-6 sticky top-24"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <div
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold mb-4 inline-block ${getSeverityColor(
                                                selectedThreat.type
                                            )}`}
                                        >
                                            {selectedThreat.type}
                                        </div>

                                        <h3 className="text-xl font-bold mb-4">
                                            {selectedThreat.title}
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">Description</p>
                                                <p className="text-white">{selectedThreat.description}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">Attack Vector</p>
                                                <p className="text-white">{selectedThreat.attackVector}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">Source Type</p>
                                                <p className="text-white">{selectedThreat.sourceType}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">Industry</p>
                                                <p className="text-white">{selectedThreat.industry}</p>
                                            </div>

                                            <div className="border-t border-white/10 pt-4">
                                                <p className="text-gray-400 text-sm mb-2">Location</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-400">Source:</span>
                                                        <span className="text-white">
                                                            {selectedThreat.source.country}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-400">Target:</span>
                                                        <span className="text-white">
                                                            {selectedThreat.target.country}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-white/10 pt-4">
                                                <p className="text-gray-400 text-sm mb-1">Detected</p>
                                                <p className="text-white">
                                                    {new Date(selectedThreat.date).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="glass-dark rounded-xl p-12 text-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                        <p className="text-gray-400">
                                            Select a threat to view details
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ThreatIntelligence;
