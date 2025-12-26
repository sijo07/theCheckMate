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
    Filter,
    BookOpen,
    Shield,
    AlertTriangle,
    TrendingUp
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
        { value: "", label: "All Categories" },
        { value: "malware_removal", label: "Malware Removal" },
        { value: "vulnerability_patch", label: "Vulnerability Patch" },
        { value: "security_config", label: "Security Config" },
        { value: "incident_response", label: "Incident Response" },
        { value: "threat_mitigation", label: "Threat Mitigation" },
        { value: "compliance_fix", label: "Compliance Fix" },
    ];

    const severities = [
        { value: "", label: "All Severities" },
        { value: "critical", label: "Critical", color: "text-red-500" },
        { value: "high", label: "High", color: "text-orange-500" },
        { value: "medium", label: "Medium", color: "text-yellow-500" },
        { value: "low", label: "Low", color: "text-green-500" },
    ];

    const handleApplySolution = async (id) => {
        try {
            await applySolution(id).unwrap();
            toast.success("Solution marked as applied!");
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to apply solution");
        }
    };

    const handleRateSolution = async (id, effectiveness) => {
        try {
            await rateSolution({ id, effectiveness }).unwrap();
            toast.success("Solution rated successfully!");
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to rate solution");
        }
    };

    const handleDeleteSolution = async (id) => {
        if (window.confirm("Are you sure you want to delete this solution?")) {
            try {
                await deleteSolution(id).unwrap();
                toast.success("Solution deleted successfully!");
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || "Failed to delete solution");
            }
        }
    };

    const getSeverityColor = (severity) => {
        const colors = {
            critical: "bg-red-500/20 text-red-400 border-red-500/50",
            high: "bg-orange-500/20 text-orange-400 border-orange-500/50",
            medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
            low: "bg-green-500/20 text-green-400 border-green-500/50",
        };
        return colors[severity] || colors.medium;
    };

    return (
        <AnimatedPage variant="fadeIn">
            <div className="min-h-screen bg-[#111112] text-white font-mono">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-black mb-1 uppercase tracking-tighter text-white">
                                Security <span className="text-red-500">Solutions</span>
                            </h1>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                BROWSE AND DEPLOY REMEDIATION PROTOCOLS
                            </p>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-glass rounded-xl p-6 mb-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="md:col-span-2 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                                <input
                                    type="text"
                                    placeholder="SEARCH REMEDIATION DATABASE..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-[#111112] border border-white/05 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest placeholder-gray-600 focus:outline-none focus:border-red-500/30 transition-all"
                                />
                            </div>

                            {/* Category Filter */}
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-3 bg-[#111112] border border-white/05 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-500/30 transition-all appearance-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value} className="bg-[#1c1c1e]">
                                        {cat.label.toUpperCase()}
                                    </option>
                                ))}
                            </select>

                            {/* Severity Filter */}
                            <select
                                value={severityFilter}
                                onChange={(e) => setSeverityFilter(e.target.value)}
                                className="px-4 py-3 bg-[#111112] border border-white/05 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-500/30 transition-all appearance-none"
                            >
                                {severities.map((sev) => (
                                    <option key={sev.value} value={sev.value} className="bg-[#1c1c1e]">
                                        {sev.label.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Create Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowCreateModal(true)}
                            className="mt-6 w-full md:w-auto px-6 py-3 bg-red-500 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Initialize Protocol</span>
                        </motion.button>
                    </motion.div>

                    {/* Solutions Grid */}
                    {isLoading ? (
                        <CardSkeleton count={6} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {solutions?.map((solution, index) => (
                                    <motion.div
                                        key={solution._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="glass-dark rounded-xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer group"
                                        onClick={() => setSelectedSolution(solution)}
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-2">
                                                    {solution.title}
                                                </h3>
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getSeverityColor(
                                                        solution.severity
                                                    )}`}
                                                >
                                                    {solution.severity}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {solution.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="w-3 h-3 text-red-500" />
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    {solution.appliedCount} DEPLOYED
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2 justify-end">
                                                <Star className="w-3 h-3 text-red-500 fill-red-500" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                                    {solution.effectiveness}% EFF.
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2 pt-4 border-t border-white/05">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleApplySolution(solution._id);
                                                }}
                                                className="flex-1 px-3 py-2 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all border border-red-500/20"
                                            >
                                                Apply
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteSolution(solution._id);
                                                }}
                                                className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all border border-red-500/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && solutions?.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24"
                        >
                            <Shield className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-700 mb-2">
                                PROTOCOL REPOSITORY EMPTY
                            </h3>
                            <p className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">
                                NO REMEDIATION ASSETS DETECTED IN ARCHIVE
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Solutions;
