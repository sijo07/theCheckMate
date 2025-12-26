import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useGetIssuesQuery,
    useCreateIssueMutation,
    useDeleteIssueMutation,
    useAssignIssueMutation,
    useResolveIssueMutation,
} from "../redux/api/issueApiSlice";
import AnimatedPage from "../components/AnimatedPage";
import { ListSkeleton } from "../components/LoadingSkeleton";
import {
    Search,
    Plus,
    AlertCircle,
    CheckCircle2,
    Clock,
    User,
    Trash2,
    MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";

const Issues = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data: issues, isLoading, refetch } = useGetIssuesQuery({
        search: searchTerm,
        type: typeFilter,
        priority: priorityFilter,
        status: statusFilter,
    });

    const [deleteIssue] = useDeleteIssueMutation();
    const [resolveIssue] = useResolveIssueMutation();

    const types = [
        { value: "", label: "All Types" },
        { value: "bug", label: "Bug" },
        { value: "security_vulnerability", label: "Security Vulnerability" },
        { value: "performance_issue", label: "Performance Issue" },
        { value: "feature_request", label: "Feature Request" },
        { value: "configuration_error", label: "Configuration Error" },
    ];

    const priorities = [
        { value: "", label: "All Priorities" },
        { value: "critical", label: "Critical", color: "text-red-500" },
        { value: "high", label: "High", color: "text-orange-500" },
        { value: "medium", label: "Medium", color: "text-yellow-500" },
        { value: "low", label: "Low", color: "text-green-500" },
    ];

    const statuses = [
        { value: "", label: "All Statuses" },
        { value: "open", label: "Open", icon: AlertCircle },
        { value: "in_progress", label: "In Progress", icon: Clock },
        { value: "resolved", label: "Resolved", icon: CheckCircle2 },
        { value: "closed", label: "Closed", icon: CheckCircle2 },
    ];

    const getPriorityColor = (priority) => {
        const colors = {
            critical: "bg-red-500/20 text-red-400 border-red-500/50",
            high: "bg-orange-500/20 text-orange-400 border-orange-500/50",
            medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
            low: "bg-green-500/20 text-green-400 border-green-500/50",
        };
        return colors[priority] || colors.medium;
    };

    const getStatusColor = (status) => {
        const colors = {
            open: "bg-blue-500/20 text-blue-400 border-blue-500/50",
            in_progress: "bg-purple-500/20 text-purple-400 border-purple-500/50",
            resolved: "bg-green-500/20 text-green-400 border-green-500/50",
            closed: "bg-gray-500/20 text-gray-400 border-gray-500/50",
        };
        return colors[status] || colors.open;
    };

    const handleDeleteIssue = async (id) => {
        if (window.confirm("Are you sure you want to delete this issue?")) {
            try {
                await deleteIssue(id).unwrap();
                toast.success("Issue deleted successfully!");
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || "Failed to delete issue");
            }
        }
    };

    const handleResolveIssue = async (id) => {
        try {
            await resolveIssue({ id, description: "Issue resolved" }).unwrap();
            toast.success("Issue marked as resolved!");
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to resolve issue");
        }
    };

    return (
        <AnimatedPage variant="fadeIn">
            <div className="min-h-screen bg-[#111112] text-white font-mono">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-black mb-1 uppercase tracking-tighter text-white">
                                Issue <span className="text-red-500">Tracker</span>
                            </h1>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                MONITOR AND MITIGATE SYSTEM ANOMALIES
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-glass rounded-xl p-6 mb-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="md:col-span-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                                <input
                                    type="text"
                                    placeholder="SEARCH ANOMALIES..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-[#111112] border border-white/05 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest placeholder-gray-600 focus:outline-none focus:border-red-500/30 transition-all"
                                />
                            </div>

                            {/* Type Filter */}
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-4 py-3 bg-[#111112] border border-white/05 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-500/30 transition-all appearance-none"
                            >
                                {types.map((type) => (
                                    <option key={type.value} value={type.value} className="bg-[#1c1c1e]">
                                        {type.label.toUpperCase()}
                                    </option>
                                ))}
                            </select>

                            {/* Priority Filter */}
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="px-4 py-3 bg-[#111112] border border-white/05 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-500/30 transition-all appearance-none"
                            >
                                {priorities.map((priority) => (
                                    <option key={priority.value} value={priority.value} className="bg-[#1c1c1e]">
                                        {priority.label.toUpperCase()}
                                    </option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 bg-[#111112] border border-white/05 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-500/30 transition-all appearance-none"
                            >
                                {statuses.map((status) => (
                                    <option key={status.value} value={status.value} className="bg-[#1c1c1e]">
                                        {status.label.toUpperCase()}
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
                            <span>Log Incident</span>
                        </motion.button>
                    </motion.div>

                    {/* Issues List */}
                    {isLoading ? (
                        <ListSkeleton items={5} />
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {issues?.map((issue, index) => (
                                    <motion.div
                                        key={issue._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="card-glass rounded-xl p-6 border border-white/05"
                                    >
                                        <div className="flex items-start justify-between">
                                            {/* Left Side */}
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-black uppercase tracking-tighter text-white">
                                                        {issue.title}
                                                    </h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getPriorityColor(
                                                            issue.priority
                                                        )}`}
                                                    >
                                                        {issue.priority}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(
                                                            issue.status
                                                        )}`}
                                                    >
                                                        {issue.status.replace("_", " ")}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm mb-4">
                                                    {issue.description}
                                                </p>
                                                <div className="flex items-center space-x-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    <div className="flex items-center space-x-1.5">
                                                        <User className="w-3 h-3 text-red-500" />
                                                        <span>{issue.reportedBy?.username || "ANONYMOUS"}</span>
                                                    </div>
                                                    {issue.assignedTo && (
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-orange-500 text-xs">→</span>
                                                            <span>{issue.assignedTo.username}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center space-x-1.5">
                                                        <MessageSquare className="w-3 h-3 text-red-500" />
                                                        <span>{issue.comments?.length || 0} SIGNALS</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side - Actions */}
                                            <div className="flex items-center space-x-2">
                                                {issue.status !== "resolved" && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleResolveIssue(issue._id)}
                                                        className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all border border-red-500/20"
                                                    >
                                                        Resolve
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDeleteIssue(issue._id)}
                                                    className="px-2.5 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all border border-red-500/20"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && issues?.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24"
                        >
                            <AlertCircle className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-700 mb-2">
                                NO ANOMALIES DETECTED
                            </h3>
                            <p className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">
                                SYSTEM INTEGRITY IS WITHIN OPTIMAL PARAMETERS
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Issues;
