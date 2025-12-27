import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useGetIssuesQuery,
    useCreateIssueMutation,
    useDeleteIssueMutation,
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
    Activity,
    Shield,
    Terminal,
    AlertTriangle,
    Bug,
    Cpu,
    Zap,
    Target
} from "lucide-react";
import { toast } from "react-toastify";

const Issues = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        type: "bug",
        priority: "medium",
    });

    const { data: issues, isLoading, refetch } = useGetIssuesQuery({
        search: searchTerm,
        type: typeFilter,
        priority: priorityFilter,
        status: statusFilter,
    });

    const [createIssue] = useCreateIssueMutation();
    const [deleteIssue] = useDeleteIssueMutation();
    const [resolveIssue] = useResolveIssueMutation();

    const types = [
        { value: "", label: "ALL_TYPES" },
        { value: "bug", label: "SYSTEM_BUG" },
        { value: "security_vulnerability", label: "VULNERABILITY" },
        { value: "performance_issue", label: "PERFORMANCE" },
        { value: "feature_request", label: "FEATURE_REQ" },
        { value: "configuration_error", label: "CONFIG_ERROR" },
    ];

    const priorities = [
        { value: "", label: "ALL_LEVELS" },
        { value: "critical", label: "CRITICAL" },
        { value: "high", label: "HIGH" },
        { value: "medium", label: "MEDIUM" },
        { value: "low", label: "LOW" },
    ];

    const statuses = [
        { value: "", label: "ALL_STATUSES" },
        { value: "open", label: "ACTIVE" },
        { value: "in_progress", label: "MITIGATING" },
        { value: "resolved", label: "NEUTRALIZED" },
        { value: "closed", label: "ARCHIVED" },
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case "bug": return Bug;
            case "security_vulnerability": return Shield;
            case "performance_issue": return Activity;
            case "configuration_error": return Cpu;
            case "feature_request": return Zap;
            default: return AlertCircle;
        }
    };

    const handleCreateIssue = async (e) => {
        e.preventDefault();
        try {
            await createIssue(formData).unwrap();
            toast.success("ANOMALY_LOGGED_SUCCESSFULLY");
            setShowCreateModal(false);
            setFormData({ title: "", description: "", location: "", type: "bug", priority: "medium" });
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "LOGGING_FAILED");
        }
    };

    // Calculate Stats
    const stats = {
        total: issues?.length || 0,
        critical: issues?.filter(i => i.priority === 'critical' && i.status !== 'resolved').length || 0,
        active: issues?.filter(i => i.status === 'open' || i.status === 'in_progress').length || 0,
    };

    return (
        <AnimatedPage variant="fadeIn">
            <div className="min-h-screen bg-[#050506] text-white font-mono relative overflow-hidden">
                {/* Cyber Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(185, 28, 28, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(185, 28, 28, 0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
                <motion.div
                    className="absolute left-0 right-0 h-1 bg-red-600/10 z-0 pointer-events-none shadow-[0_0_20px_#ef4444]"
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 lg:py-8 relative z-10">

                    {/* Header & Stats */}
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-8 border-b border-red-900/30 pb-6">
                        <div>
                            <div className="flex items-center gap-3 text-red-500 mb-2">
                                <Activity className="w-6 h-6 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">Live_System_Monitor</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white glitch-text mb-4">
                                Anomaly <span className="text-red-600">Detection</span>
                            </h1>
                        </div>

                        {/* HUD Stats */}
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-red-950/20 border border-red-500/30 p-4 flex-1 md:flex-none md:min-w-[120px]">
                                <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Critical_Alerts</div>
                                <div className="text-3xl font-black text-red-500">{stats.critical}</div>
                            </div>
                            <div className="bg-[#0a0a0b] border border-red-900/30 p-4 flex-1 md:flex-none md:min-w-[120px]">
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Active_Anomalies</div>
                                <div className="text-3xl font-black text-white">{stats.active}</div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Console */}
                    <div className="bg-[#0a0a0b] border border-red-900/30 p-1 mb-8 flex flex-col md:flex-row gap-0">
                        <div className="flex-1 flex items-center relative border-b md:border-b-0 md:border-r border-red-900/30">
                            <Search className="absolute left-4 w-4 h-4 text-red-500" />
                            <input
                                type="text"
                                placeholder="SCAN_LOC_RECORDS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoComplete="off"
                                className="w-full bg-transparent text-white text-xs font-bold uppercase tracking-widest py-4 pl-12 focus:outline-none placeholder-gray-700"
                            />
                        </div>
                        {[
                            { value: typeFilter, set: setTypeFilter, options: types },
                            { value: priorityFilter, set: setPriorityFilter, options: priorities },
                            { value: statusFilter, set: setStatusFilter, options: statuses }
                        ].map((filter, i) => (
                            <div key={i} className="border-b md:border-b-0 md:border-r border-red-900/30 last:border-0">
                                <select
                                    value={filter.value}
                                    onChange={(e) => filter.set(e.target.value)}
                                    className="h-full bg-transparent text-gray-400 text-xs font-bold uppercase tracking-widest px-6 py-4 focus:outline-none cursor-pointer hover:bg-white/5 transition-colors"
                                >
                                    {filter.options.map((opt) => (
                                        <option key={opt.value} value={opt.value} className="bg-[#0a0a0b]">
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-end mb-8">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                        >
                            <Plus className="w-4 h-4" />
                            Log_Incident
                        </button>
                    </div>

                    {/* Issues Grid */}
                    {isLoading ? (
                        <ListSkeleton count={5} />
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {issues?.map((issue, index) => {
                                    const TypeIcon = getTypeIcon(issue.type);
                                    return (
                                        <motion.div
                                            key={issue._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative bg-[#0a0a0b] border border-red-900/20 hover:border-red-500/50 p-6 transition-all duration-300"
                                        >
                                            {/* Hover Glow */}
                                            <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 border ${issue.priority === 'critical' ? 'bg-red-900/20 border-red-500 text-red-500 animate-pulse' : 'bg-gray-900/50 border-gray-700 text-gray-400'}`}>
                                                        <TypeIcon className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 border whitespace-nowrap ${issue.priority === 'critical' ? 'border-red-500 text-red-500' :
                                                                    issue.priority === 'high' ? 'border-orange-500 text-orange-500' :
                                                                        'border-emerald-500 text-emerald-500'
                                                                    }`}>
                                                                    {issue.priority}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider group-hover:text-red-500 transition-colors break-words">
                                                                {issue.title}
                                                            </h3>
                                                        </div>
                                                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wide leading-relaxed max-w-2xl mb-4 break-words">
                                                            {issue.description}
                                                        </p>

                                                        {/* Metadata */}
                                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                                            <div className="flex items-center gap-2">
                                                                <Target className="w-3 h-3" />
                                                                <span>ID: {issue._id.slice(-6)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-3 h-3" />
                                                                <span>REP: {issue.reportedBy?.username || "UNKNOWN"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-red-900/10">
                                                    <div className={`px-4 py-2 border text-[10px] font-black uppercase tracking-widest ${issue.status === 'resolved' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' : 'border-red-500/30 text-red-500 bg-red-950/10'}`}>
                                                        {issue.status === 'resolved' ? 'Neutralized' : 'Active_Anomaly'}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {/* Empty State */}
                            {!isLoading && issues?.length === 0 && (
                                <div className="text-center py-24 border border-red-900/30 bg-[#0a0a0b]">
                                    <Shield className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                                    <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">System_Secure</h3>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">No Active Anomalies Detected</p>
                                </div>
                            )}
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
                                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative bg-[#0a0a0b] border border-red-600 w-full max-w-2xl shadow-[0_0_50px_rgba(220,38,38,0.2)]"
                            >
                                <div className="bg-red-600 p-1 flex justify-between items-center px-4 py-2">
                                    <span className="text-black text-xs font-black uppercase tracking-widest">Incident_Report_Form</span>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-black rounded-full" />
                                        <div className="w-2 h-2 bg-black/50 rounded-full" />
                                    </div>
                                </div>

                                <form onSubmit={handleCreateIssue} className="p-6 md:p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                                        <div className="col-span-2">
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Anomaly_Subject</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-[#111] border border-red-900/30 p-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                                                placeholder="IDENTIFY_THREAT..."
                                                autoComplete="off"
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Location_Vector</label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full bg-[#111] border border-red-900/30 p-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                                                placeholder="SPECIFY_NODE_OR_REGION..."
                                                autoComplete="off"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Threat_Classification</label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full bg-[#111] border border-red-900/30 p-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                                            >
                                                {types.filter(t => t.value).map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Severity_Level</label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                                className="w-full bg-[#111] border border-red-900/30 p-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                                            >
                                                {priorities.filter(p => p.value).map(p => (
                                                    <option key={p.value} value={p.value}>{p.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-span-2">
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Technical_Details</label>
                                            <textarea
                                                rows="4"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full bg-[#111] border border-red-900/30 p-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                                                placeholder="DESCRIBE_ANOMALY_PARAMETERS..."
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="flex-1 py-4 border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 uppercase font-bold text-xs tracking-widest transition-colors"
                                        >
                                            Cancel_Report
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white uppercase font-black text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all"
                                        >
                                            Upload_Incident
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

export default Issues;
