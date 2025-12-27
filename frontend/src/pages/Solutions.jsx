import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useGetSolutionsQuery,
    useCreateSolutionMutation,
    useDeleteSolutionMutation,
    useApplySolutionMutation,
    useRateSolutionMutation,
} from "../redux/api/solutionApiSlice";
import AnimatedPage from "../components/AnimatedPage";
import { CardSkeleton } from "../components/LoadingSkeleton";
import {
    Search,
    Plus,
    CheckCircle,
    Star,
    Trash2,
    Shield,
    AlertTriangle,
    Terminal,
    Database,
    Zap,
    Lock
} from "lucide-react";
import { toast } from "react-toastify";

const Solutions = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [severityFilter, setSeverityFilter] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedSolution, setSelectedSolution] = useState(null);

    const { data: solutions, isLoading, refetch } = useGetSolutionsQuery({
        search: searchTerm,
        category: categoryFilter,
        severity: severityFilter,
    });

    const [createSolution] = useCreateSolutionMutation();
    const [deleteSolution] = useDeleteSolutionMutation();
    const [applySolution] = useApplySolutionMutation();
    const [rateSolution] = useRateSolutionMutation();

    const categories = [
        { value: "", label: "ALL_SYSTEMS" },
        { value: "malware_removal", label: "MALWARE_PURGE" },
        { value: "vulnerability_patch", label: "VULN_PATCH" },
        { value: "security_config", label: "SEC_CONFIG" },
        { value: "incident_response", label: "INCIDENT_RESP" },
        { value: "threat_mitigation", label: "THREAT_MITIGATION" },
    ];

    const severities = [
        { value: "", label: "ALL_LEVELS" },
        { value: "critical", label: "CRITICAL" },
        { value: "high", label: "HIGH" },
        { value: "medium", label: "MEDIUM" },
        { value: "low", label: "LOW" },
    ];

    const handleApplySolution = async (id, title) => {
        try {
            await applySolution(id).unwrap();
            toast.success(`PATCH_DEPLOYED: ${title}`);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "DEPLOYMENT_FAILED");
        }
    };

    const handleDeleteSolution = async (id) => {
        if (window.confirm("CONFIRM_DELETION: Remove protocol from archive?")) {
            try {
                await deleteSolution(id).unwrap();
                toast.success("PROTOCOL_DELETED");
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || "DELETION_FAILED");
            }
        }
    };

    const getSeverityStyles = (severity) => {
        const styles = {
            critical: "text-red-500 border-red-500 bg-red-950/30",
            high: "text-orange-500 border-orange-500 bg-orange-950/30",
            medium: "text-yellow-500 border-yellow-500 bg-yellow-950/30",
            low: "text-green-500 border-green-500 bg-green-950/30",
        };
        return styles[severity] || styles.medium;
    };


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "other",
        severity: "medium",
        location: "",
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateSolution = async (e) => {
        e.preventDefault();
        try {
            await createSolution(formData).unwrap();
            toast.success(`PROTOCOL_COMPILED: ${formData.title.toUpperCase()}`);
            setShowCreateModal(false);
            setFormData({ title: "", description: "", category: "other", severity: "medium", location: "" });
        } catch (error) {
            toast.error(error?.data?.message || "COMPILATION_FAILED");
        }
    };

    return (
        <AnimatedPage variant="fadeIn">
            <div className="min-h-screen bg-[#050506] text-white font-mono relative overflow-hidden">
                {/* Background Cyber Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(185, 28, 28, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(185, 28, 28, 0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Scanning Laser */}
                <motion.div
                    className="absolute left-0 right-0 h-1 bg-red-600/10 z-0 pointer-events-none shadow-[0_0_20px_#ef4444]"
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-8 border-b border-red-900/30 pb-6">
                        <div>
                            <div className="flex items-center gap-3 text-red-500 mb-2">
                                <Shield className="w-6 h-6 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">Remediation_Center</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white glitch-text mb-4">
                                Active <span className="text-red-600">Solutions</span>
                            </h1>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest max-w-lg leading-relaxed">
                                Deploy remediation patches and security configurations. Execute protocols to neutralize active threats.
                            </p>
                        </div>

                        {/* Live Metrics */}
                        <div className="flex gap-4">
                            <div className="bg-red-900/10 border border-red-900/30 p-4">
                                <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Patches_Available</div>
                                <div className="text-2xl font-black text-white">{solutions?.length || 0}</div>
                            </div>
                            <div className="bg-red-900/10 border border-red-900/30 p-4">
                                <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Protocol_Efficacy</div>
                                <div className="text-2xl font-black text-emerald-500">98.4%</div>
                            </div>
                        </div>
                    </div>

                    {/* Command Console */}
                    <div className="bg-[#0a0a0b] border border-red-900/30 p-1 mb-8 flex flex-col md:flex-row items-stretch shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        <div className="flex-1 flex items-center relative border-b md:border-b-0 md:border-r border-red-900/30 py-2">
                            <Terminal className="absolute left-4 w-5 h-5 text-red-500" />
                            <input
                                type="text"
                                placeholder="QUERY_REMEDIATION_DB..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoComplete="off"
                                className="w-full bg-transparent text-white text-xs font-bold uppercase tracking-widest py-3 pl-12 focus:outline-none placeholder-gray-700"
                            />
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-transparent text-red-500 text-xs font-bold uppercase tracking-widest py-2 px-6 focus:outline-none cursor-pointer hover:bg-red-900/10 transition-colors border-r border-red-900/30"
                        >
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value} className="bg-[#0a0a0b]">{cat.label}</option>
                            ))}
                        </select>
                        <select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                            className="bg-transparent text-red-500 text-xs font-bold uppercase tracking-widest py-2 px-6 focus:outline-none cursor-pointer hover:bg-red-900/10 transition-colors"
                        >
                            {severities.map((sev) => (
                                <option key={sev.value} value={sev.value} className="bg-[#0a0a0b]">{sev.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Initialize Button */}
                    <div className="flex justify-end mb-8">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowCreateModal(true)}
                            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Initialize_New_Protocol
                        </motion.button>
                    </div>

                    {/* Solutions Grid */}
                    {isLoading ? (
                        <CardSkeleton count={6} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {solutions?.map((solution, index) => (
                                    <motion.div
                                        key={solution._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-[#0a0a0b] border border-red-900/20 hover:border-red-500/50 group relative overflow-hidden transition-all duration-300"
                                    >
                                        {/* Status Bar */}
                                        <div className={`h-1 w-full ${getSeverityStyles(solution.severity).includes('red') ? 'bg-red-600' : getSeverityStyles(solution.severity).includes('orange') ? 'bg-orange-600' : 'bg-green-600'} opacity-50`} />

                                        <div className="p-8">
                                            {/* Header */}
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-3 bg-white/05 border border-white/10 group-hover:border-red-500/30 transition-colors">
                                                    <Database className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-widest border mb-1 ${getSeverityStyles(solution.severity)}`}>
                                                        {solution.severity}
                                                    </span>
                                                    {solution.location && (
                                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex justify-end gap-1 items-center">
                                                            📍 {solution.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <h3 className="text-xl font-black uppercase tracking-wide text-white mb-3 group-hover:text-red-500 transition-colors">
                                                {solution.title}
                                            </h3>
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wide leading-relaxed mb-6 line-clamp-3">
                                                {solution.description}
                                            </p>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-4 mb-8 bg-red-900/5 p-4 border border-red-900/10">
                                                <div>
                                                    <div className="text-[8px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                        <Zap className="w-3 h-3" /> Efficacy
                                                    </div>
                                                    <div className="text-base font-bold text-white">{solution.effectiveness}%</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[8px] text-gray-500 uppercase tracking-wider mb-1">Deployed</div>
                                                    <div className="text-base font-bold text-white">{solution.appliedCount}</div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleApplySolution(solution._id, solution.title)}
                                                    className="flex-1 py-3 bg-red-600/10 border border-red-600/30 hover:bg-red-600 hover:text-white text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all"
                                                >
                                                    Deploy_Patch
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSolution(solution._id)}
                                                    className="px-4 border border-gray-800 hover:border-red-500/50 hover:bg-red-900/10 text-gray-500 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Empty State */}
                                {!isLoading && solutions?.length === 0 && (
                                    <div className="col-span-full py-24 text-center border active border-red-900/30 bg-[#0a0a0b]">
                                        <AlertTriangle className="w-16 h-16 text-red-900/50 mx-auto mb-6" />
                                        <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Database_Null</h3>
                                        <p className="text-gray-500 text-xs uppercase tracking-widest">No active remediation protocols found.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Create Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowCreateModal(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-[#0a0a0b] border border-red-600 w-full max-w-lg shadow-[0_0_50px_rgba(220,38,38,0.2)]"
                            >
                                <div className="p-1 bg-red-600 flex justify-between items-center text-black px-4 py-2 mb-4">
                                    <span className="text-xs font-black uppercase tracking-widest">Protocol_Constructor</span>
                                    <Plus className="w-4 h-4 rotate-45" onClick={() => setShowCreateModal(false)} />
                                </div>

                                <form onSubmit={handleCreateSolution} className="p-8 pt-2">
                                    <div className="space-y-6 mb-8">
                                        <div>
                                            <label className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2 block">Protocol_Identity</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full bg-[#111] border border-red-900/30 p-3 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                                                    placeholder="ENTER_PROTOCOL_NAME"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Category_Type</label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#111] border border-red-900/30 p-3 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                                                >
                                                    {categories.filter(c => c.value).map(c => (
                                                        <option key={c.value} value={c.value}>{c.label}</option>
                                                    ))}
                                                    <option value="other">OTHER</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Threat_Level</label>
                                                <select
                                                    name="severity"
                                                    value={formData.severity}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#111] border border-red-900/30 p-3 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                                                >
                                                    {severities.filter(s => s.value).map(s => (
                                                        <option key={s.value} value={s.value}>{s.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Target_Sector</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#111] border border-red-900/30 p-3 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                                                    placeholder="ENTER_GEO_OR_ASSET_LOCATION"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Technical_Specification</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                rows="4"
                                                className="w-full bg-[#111] border border-red-900/30 p-3 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors resize-none"
                                                placeholder="ENTER_PROTOCOL_DETAILS..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="flex-1 py-4 border border-gray-700 text-gray-300 hover:bg-white/5 uppercase font-bold text-xs tracking-widest transition-colors"
                                        >
                                            Abort
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white uppercase font-black text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
                                        >
                                            Compile_Protocol
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </AnimatedPage>
    );
};

export default Solutions;
