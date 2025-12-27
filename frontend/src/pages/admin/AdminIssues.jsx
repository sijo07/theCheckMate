import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useGetAllIncidentsQuery,
    useResolveIncidentMutation,
    useDeleteIncidentMutation,
} from "../../redux/api/incidentApiSlice";
import AnimatedPage from "../../components/AnimatedPage";
import {
    Activity,
    Shield,
    Trash2,
    CheckCircle2,
    AlertTriangle,
    Terminal,
    Search,
    ChevronDown,
    Zap,
    Cpu,
    Target,
    User,
    Clock
} from "lucide-react";
import { toast } from "react-toastify";

const AdminIssues = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");

    const { data: issues = [], isLoading, refetch } = useGetAllIncidentsQuery();
    const [resolveIssue] = useResolveIncidentMutation();
    const [deleteIssue] = useDeleteIncidentMutation();

    const handleResolveIssue = async (id) => {
        try {
            await resolveIssue(id).unwrap();
            toast.success("ANOMALY_NEUTRALIZED");
            refetch();
        } catch (error) {
            toast.error("NEUTRALIZATION_FAILED");
        }
    };

    const handleDeleteIssue = async (id) => {
        if (window.confirm("CONFIRM_PURGE_SEQUENCE? This will erase all trace of the anomaly.")) {
            try {
                await deleteIssue(id).unwrap();
                toast.success("ANOMALY_PURGED");
                refetch();
            } catch (error) {
                toast.error("PURGE_FAILED");
            }
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    const stats = {
        total: issues.length,
        critical: issues.filter(i => i.priority === 'critical' && i.status !== 'resolved').length,
        active: issues.filter(i => i.status !== 'resolved').length
    };

    return (
        <AnimatedPage variant="fadeIn">
            <div className="space-y-8">
                {/* Command Header */}
                <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-12 border-b border-red-900/30 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-red-500">
                            <Terminal className="w-4 h-4 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Command_Authority_Level_4</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white glitch-text mb-4">
                            Incident <span className="text-red-600">Control</span>
                        </h1>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                            Manage and neutralize system-wide anomalies. Authorized personnel only.
                        </p>
                    </div>

                    {/* Tactical Stats HUD */}
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-red-950/20 border border-red-500/30 p-4 min-w-[140px]">
                            <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Critical_Alerts</div>
                            <div className="text-3xl font-black text-red-500">{stats.critical}</div>
                        </div>
                        <div className="bg-[#0a0a0b] border border-red-900/30 p-4 min-w-[140px]">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Command_Load</div>
                            <div className="text-3xl font-black text-white">{stats.active}</div>
                        </div>
                    </div>
                </div>

                {/* Filter Console */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
                    <div className="md:col-span-8 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                        <input
                            type="text"
                            placeholder="QUERY_ANOMALY_DATABASE..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-red-950/5 border border-red-900/20 py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>
                    <div className="md:col-span-4 relative group">
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="w-full bg-red-950/5 border border-red-900/20 py-4 px-4 text-xs font-bold uppercase tracking-widest focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="all">ALL_PRIORITIES</option>
                            <option value="critical">PRIORITY_CRITICAL</option>
                            <option value="high">PRIORITY_HIGH</option>
                            <option value="medium">PRIORITY_MED</option>
                            <option value="low">PRIORITY_LOW</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 pointer-events-none" />
                    </div>
                </div>

                {/* Incident Management Grid */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredIssues.map((issue, index) => (
                            <motion.div
                                key={issue._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className={`relative group bg-black border ${issue.priority === 'critical' ? 'border-red-500/30' : 'border-white/5'} hover:border-red-500 transition-all overflow-hidden`}
                            >
                                {/* Status Indicator */}
                                <div className={`absolute top-0 right-0 w-16 h-1 ${issue.status === 'resolved' ? 'bg-emerald-500' : 'bg-red-500'} opacity-50`} />

                                <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border whitespace-nowrap ${issue.priority === 'critical' ? 'border-red-500 text-red-500 bg-red-950/20' : 'border-gray-700 text-gray-500'}`}>
                                                {issue.priority}_PRIORITY
                                            </span>
                                            <h3 className="text-xl font-black text-white uppercase tracking-wider truncate">
                                                {issue.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wide leading-relaxed max-w-4xl mb-6 break-words">
                                            {issue.description}
                                        </p>

                                        {/* Tactical Metadata */}
                                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <Target className="w-3.5 h-3.5 text-red-500" />
                                                <span>SIG_ID: {issue._id.toUpperCase()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5" />
                                                <span>OPERATOR: {issue.reportedBy?.username || "SYS_AUTO"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>STAMP: {new Date(issue.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Command Actions */}
                                    <div className="flex flex-row md:flex-col lg:flex-row items-center gap-3 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-white/5">
                                        {issue.status !== "resolved" ? (
                                            <button
                                                onClick={() => handleResolveIssue(issue._id)}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-black border border-red-500/50 hover:border-red-500 text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.1)]"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Neutralize
                                            </button>
                                        ) : (
                                            <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                Neutralized
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleDeleteIssue(issue._id)}
                                            className="p-4 text-gray-600 hover:text-red-500 transition-colors bg-white/5 hover:bg-red-950/20 border border-transparent hover:border-red-900/50"
                                            title="Purge Record"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredIssues.length === 0 && !isLoading && (
                        <div className="py-24 text-center border border-dashed border-red-900/20">
                            <Activity className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                            <div className="text-gray-500 text-xs uppercase tracking-[0.3em]">NO_ANOMALIES_DETECTED_IN_SCOPE</div>
                        </div>
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default AdminIssues;
