import { useState } from "react";
import { motion } from "framer-motion";
import {
    useGetServicesQuery,
    useCreateServiceRequestMutation,
} from "../redux/api/serviceApiSlice";
import { useSelector } from "react-redux";
import AnimatedPage from "../components/AnimatedPage";
import { CardSkeleton } from "../components/LoadingSkeleton";
import {
    Shield,
    Terminal,
    Lock,
    AlertTriangle,
    Zap,
    Search,
    ChevronDown,
    Activity,
    Cpu,
    Crosshair,
    Server,
    Wifi
} from "lucide-react";
import { toast } from "react-toastify";

const Services = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);

    const { data: services = [], isLoading } = useGetServicesQuery({
        search: searchTerm,
        category: categoryFilter,
        status: "active",
    });

    const [createServiceRequest] = useCreateServiceRequestMutation();

    const categories = [
        { value: "", label: "ALL_PROTOCOLS" },
        { value: "threat_analysis", label: "THREAT_ANALYSIS" },
        { value: "vulnerability_assessment", label: "VULN_ASSESSMENT" },
        { value: "penetration_testing", label: "PEN_TESTING" },
        { value: "security_audit", label: "SEC_AUDIT" },
        { value: "incident_response", label: "INCIDENT_RESPONSE" },
    ];

    const handleRequestService = (service) => {
        setSelectedService(service);
        setShowRequestModal(true);
    };

    const confirmRequest = async () => {
        try {
            await createServiceRequest({
                service: selectedService._id,
                requirements: "Standard Deployment Protocol", // Default generic requirement
                status: 'pending'
            }).unwrap();

            toast.success(`PROTOCOL_INITIATED: ${selectedService.name.toUpperCase()}`);
            setShowRequestModal(false);
        } catch (error) {
            toast.error(error?.data?.message || "INITIATION_FAILED");
        }
    };

    return (
        <AnimatedPage variant="fadeIn">
            <div className="min-h-screen bg-[#020202] text-gray-300 font-mono relative overflow-hidden pb-20 selection:bg-red-500/30 selection:text-red-200">
                {/* --- Cyber Environment Background --- */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Static Grid */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    {/* Moving Scanline */}
                    <motion.div
                        className="absolute w-full h-[2px] bg-red-600/20 shadow-[0_0_20px_rgba(220,38,38,0.5)] z-0"
                        animate={{ top: ['-10%', '110%'] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Radial Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />
                </div>

                <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-10 lg:pt-24 pb-12 relative z-10">

                    {/* --- Header Architecture --- */}
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16 border-b border-white/5 pb-8 relative">
                        {/* Decorative Header Lines */}
                        <div className="absolute -bottom-px left-0 w-24 h-1 bg-red-600" />
                        <div className="absolute -bottom-px right-0 w-8 h-1 bg-white/20" />

                        <div>
                            <div className="flex items-center gap-3 text-red-500 mb-2">
                                <Activity className="w-4 h-4 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Countermeasures_Database</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white glitch-text mb-4">
                                Offensive<span className="text-red-600">.Ops</span>
                            </h1>
                            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest max-w-xl leading-relaxed">
                                deploy advanced cybersecurity protocols. select targets for autonomous neutralization.
                                unauthorized access is strictly monitored.
                            </p>
                        </div>

                        {/* Header Stats Holo-Display */}
                        <div className="flex gap-1 md:gap-4">
                            <div className="bg-white/5 border border-white/10 p-4 min-w-[140px] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-1 opacity-50">
                                    <Cpu className="w-4 h-4 text-red-500/50" />
                                </div>
                                <span className="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Sys_Load</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-black text-white">42<span className="text-sm text-red-500">%</span></span>
                                    <div className="h-6 flex items-end gap-[2px] opacity-50">
                                        {[4, 8, 3, 7, 2, 9].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-red-500"
                                                animate={{ height: ['20%', `${h * 10}%`, '40%'] }}
                                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 min-w-[140px] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-1 opacity-50">
                                    <Server className="w-4 h-4 text-emerald-500/50" />
                                </div>
                                <span className="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Nodes_Active</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-black text-white">892</span>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mb-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Command Interface --- */}
                    <div className="flex flex-col md:flex-row gap-4 mb-12 bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-lg">
                        {/* Search Input */}
                        <div className="relative flex-1 group">
                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 group-focus-within:bg-red-600 transition-colors" />
                            <div className="relative flex items-center px-4 py-3 bg-white/5 group-hover:bg-white/10 transition-colors">
                                <span className="text-red-500 font-bold mr-4 font-mono text-xs">{">"}</span>
                                <input
                                    type="text"
                                    placeholder="INIT_QUERY_SEQUENCE..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent text-white text-xs font-bold uppercase tracking-widest focus:outline-none placeholder-gray-600"
                                />
                                <Search className="w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                            </div>
                        </div>

                        {/* Filter Dropdown */}
                        <div className="relative w-full md:w-72">
                            <div className="h-full bg-white/5 hover:bg-white/10 transition-colors flex items-center px-4 border-l border-white/5 py-3 cursor-pointer group relative">
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                                <div className="flex items-center justify-between w-full pointer-events-none">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                                        FILTER: <span className="text-red-500">{categoryFilter ? categories.find(c => c.value === categoryFilter)?.label : "ALL_SYSTEMS"}</span>
                                    </span>
                                    <ChevronDown className="w-3 h-3 text-red-500" />
                                </div>
                                {/* Corner Accents */}
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500/30 group-hover:border-red-500 transition-colors" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500/30 group-hover:border-red-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* --- Services Grid --- */}
                    {isLoading ? (
                        <CardSkeleton count={6} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.isArray(services) && services.map((service, index) => (
                                <motion.div
                                    key={service._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleRequestService(service)}
                                    className="group relative h-[320px] bg-[#080808] border border-white/5 hover:border-red-600/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                                >
                                    {/* Hover Reveal Background */}
                                    <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Crosshair className="w-5 h-5 text-red-500 animate-[spin_3s_linear_infinite]" />
                                    </div>

                                    {/* Content Container */}
                                    <div className="p-8 relative z-10 flex flex-col h-full">
                                        {/* Icon & ID */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-600 group-hover:text-black group-hover:border-red-600 transition-all duration-300 text-gray-400">
                                                {service.category === 'threat_analysis' ? <Activity size={20} /> :
                                                    service.category === 'penetration_testing' ? <Zap size={20} /> :
                                                        service.category === 'security_audit' ? <Shield size={20} /> :
                                                            <Lock size={20} />}
                                            </div>
                                            <span className="text-[9px] font-mono text-gray-600 uppercase">
                                                ID_0{index + 1}
                                            </span>
                                        </div>

                                        {/* Titles */}
                                        <div className="mb-4">
                                            <h3 className="text-xl font-black uppercase text-white mb-2 leading-none group-hover:text-red-500 transition-colors">
                                                {service.name}
                                            </h3>
                                            <div className="h-[2px] w-12 bg-white/10 group-hover:w-full group-hover:bg-red-600 transition-all duration-500" />
                                        </div>

                                        {/* Description */}
                                        <p className="text-[10px] text-gray-500 uppercase font-mono leading-relaxed mb-auto line-clamp-3">
                                            {service.description}
                                        </p>

                                        {/* Specs */}
                                        <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/5 mt-6">
                                            <div className="bg-[#080808] p-3 group-hover:bg-[#0c0c0c] transition-colors">
                                                <span className="block text-[8px] text-gray-600 uppercase mb-1">Cost_Basis</span>
                                                <span className="block text-xs font-bold text-white">
                                                    {service.pricing?.type === "fixed" ? `$${service.pricing.amount}` : "Dynamic"}
                                                </span>
                                            </div>
                                            <div className="bg-[#080808] p-3 group-hover:bg-[#0c0c0c] transition-colors">
                                                <span className="block text-[8px] text-gray-600 uppercase mb-1">Duration</span>
                                                <span className="block text-xs font-bold text-white">
                                                    {service.duration ? `${service.duration.value} ${service.duration.unit}` : "Flexible"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Strip (Visible on Hover) */}
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- Global Operations Feed (New Section) --- */}
                <div className="border-t border-white/5 bg-black/50 backdrop-blur-sm mt-12 py-12">
                    <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                        <div className="flex items-center gap-4 mb-8">
                            <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Global_Operations_Stream</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Feed Column */}
                            <div className="lg:col-span-3 bg-[#050505] border border-white/5 p-6 h-64 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#050505] to-transparent z-10" />
                                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#050505] to-transparent z-10" />

                                <motion.div
                                    className="space-y-3 font-mono text-[10px] text-gray-500"
                                    animate={{ y: [0, -100] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                >
                                    {[...Array(15)].map((_, i) => (
                                        <div key={i} className="flex justify-between border-b border-white/5 pb-1">
                                            <span className="text-red-900">[{new Date().toLocaleTimeString()}:{Math.floor(Math.random() * 99)}]</span>
                                            <span className="text-gray-400">EXEC_PROTOCOL_ID_{Math.floor(Math.random() * 9999)}</span>
                                            <span className="text-white">TARGET_REGION: {['NA', 'EU', 'AS', 'SA'][Math.floor(Math.random() * 4)]}</span>
                                            <span className={['text-emerald-500', 'text-yellow-500', 'text-red-500'][Math.floor(Math.random() * 3)]}>
                                                {['SUCCESS', 'PENDING', 'WARNING'][Math.floor(Math.random() * 3)]}
                                            </span>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Stats Column */}
                            <div className="space-y-4">
                                <div className="bg-red-900/10 border border-red-500/20 p-6">
                                    <span className="block text-[9px] uppercase tracking-widest text-red-400 mb-2">Total_Deployments</span>
                                    <span className="text-4xl font-black text-white">14,209</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6">
                                    <span className="block text-[9px] uppercase tracking-widest text-gray-500 mb-2">Active_Nodes</span>
                                    <span className="text-4xl font-black text-white">892</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Mission Dossier Modal (Advanced) --- */}
                {showRequestModal && selectedService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setShowRequestModal(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative bg-[#050505] border border-white/10 w-full max-w-4xl max-h-[90vh] lg:h-[80vh] flex flex-col shadow-[0_0_100px_rgba(220,38,38,0.1)] overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="h-12 bg-white/5 border-b border-white/10 flex justify-between items-center px-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 bg-red-500 animate-pulse" />
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-white">
                                        Mission_Dossier // {selectedService.name}
                                    </span>
                                </div>
                                <div className="flex text-[10px] font-mono gap-4 text-gray-500">
                                    <span>SEC_LEVEL: ALPHA</span>
                                    <span>AUTH_KEY: {selectedService._id.slice(0, 8).toUpperCase()}</span>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                                {/* Sidebar: Technical Specs */}
                                <div className="w-full lg:w-1/3 bg-black/50 border-b lg:border-b-0 lg:border-r border-white/5 p-6 space-y-8 overflow-y-auto">
                                    <div>
                                        <h4 className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Crosshair size={12} /> Operational_Parameters
                                        </h4>
                                        <div className="space-y-4 font-mono text-xs">
                                            <div className="bg-white/5 p-3 border-l-2 border-red-500">
                                                <span className="block text-gray-500 text-[9px] uppercase mb-1">Target Protocol</span>
                                                <span className="text-white font-bold">{selectedService.name}</span>
                                            </div>
                                            <div className="bg-white/5 p-3 border-l-2 border-white/20">
                                                <span className="block text-gray-500 text-[9px] uppercase mb-1">Est. Duration</span>
                                                <span className="text-white">{selectedService.duration ? `${selectedService.duration.value} ${selectedService.duration.unit}` : "Variable Cycle"}</span>
                                            </div>
                                            <div className="bg-white/5 p-3 border-l-2 border-white/20">
                                                <span className="block text-gray-500 text-[9px] uppercase mb-1">Resource Cost</span>
                                                <span className="text-white">{selectedService.pricing?.type === "fixed" ? `$${selectedService.pricing.amount}` : "Dynamic Allocation"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Cpu size={12} /> System_Metrics
                                        </h4>
                                        <div className="space-y-3">
                                            {[
                                                { label: "Success_Probability", val: 98, color: "bg-emerald-500" },
                                                { label: "Encryption_Strength", val: 100, color: "bg-red-500" },
                                                { label: "Network_Impact", val: 45, color: "bg-yellow-500" }
                                            ].map((stat, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-[9px] uppercase mb-1 text-gray-400">
                                                        <span>{stat.label}</span>
                                                        <span>{stat.val}%</span>
                                                    </div>
                                                    <div className="h-1 bg-white/10 w-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full ${stat.color}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${stat.val}%` }}
                                                            transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 border border-red-600/20 bg-red-900/5 text-[10px] text-red-400 font-mono leading-relaxed">
                                        <AlertTriangle size={12} className="inline mr-2 mb-1" />
                                        WARNING: Deployment of this protocol grants autonomous access to specified subsystems. Audit logs will be generated.
                                    </div>
                                </div>

                                {/* Main Content: Briefing */}
                                <div className="flex-1 p-8 flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent">
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-black uppercase text-white mb-6">Mission Briefing</h3>
                                        <p className="text-sm font-mono text-gray-400 leading-7 max-w-2xl mb-8">
                                            {selectedService.description}
                                        </p>

                                        {/* Fake Terminal Output */}
                                        <div className="bg-black border border-white/10 p-4 font-mono text-[10px] text-gray-500 h-48 overflow-hidden relative">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-white/10" />
                                            <div className="space-y-1">
                                                <p className="text-green-500">{">"} ESTABLISHING_SECURE_UPLINK...</p>
                                                <p>{">"} HANDSHAKE_COMPLETE_ [23ms]</p>
                                                <p>{">"} RETRIEVING_TARGET_METADATA...</p>
                                                <p>{">"} ANALYZING_VULNERABILITY_VECTORS...</p>
                                                <p>{">"} COMPILING_EXECUTION_PAYLOAD...</p>
                                                <p>{">"} READY_FOR_DEPLOYMENT</p>
                                                <motion.div
                                                    className="w-2 h-4 bg-red-500"
                                                    animate={{ opacity: [0, 1, 0] }}
                                                    transition={{ duration: 0.8, repeat: Infinity }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="mt-8 flex gap-4 pt-6 border-t border-white/10">
                                        <button
                                            onClick={() => setShowRequestModal(false)}
                                            className="px-8 py-4 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition-all"
                                        >
                                            Abort_Mission
                                        </button>
                                        {userInfo?.isAdmin ? (
                                            <button
                                                onClick={confirmRequest}
                                                className="flex-1 bg-red-600 hover:bg-red-500 text-black text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] flex items-center justify-center gap-3 relative overflow-hidden group"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    <Terminal size={14} /> Initialize_Protocol
                                                </span>
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform skew-y-12" />
                                            </button>
                                        ) : (
                                            <div className="flex-1 bg-gray-900 text-gray-500 border border-white/10 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-not-allowed opacity-75">
                                                <Lock size={14} /> Restricted // Admin_Only
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </AnimatedPage >
    );
};

export default Services;
