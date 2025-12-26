import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import Navbar from "../components/Navbar";
import { PageSkeleton } from "../components/LoadingSkeleton";
import {
    useGetReportsQuery,
    useCreateReportMutation,
    useDeleteReportMutation,
    useGetReportDataQuery,
} from "../redux/api/reportApiSlice";
import {
    FileText,
    Download,
    Trash2,
    Calendar,
    Filter,
    Plus,
    Eye,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader as LoaderIcon,
} from "lucide-react";
import { toast } from "react-toastify";

const Reports = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        type: "custom",
        dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            end: new Date().toISOString().split("T")[0],
        },
        format: "pdf",
    });

    const { data: reports = [], isLoading, refetch } = useGetReportsQuery();
    const [createReport, { isLoading: isCreating }] = useCreateReportMutation();
    const [deleteReport] = useDeleteReportMutation();

    const handleCreateReport = async (e) => {
        e.preventDefault();
        try {
            await createReport(formData).unwrap();
            toast.success("Report generation started!");
            setShowCreateModal(false);
            setFormData({
                title: "",
                type: "custom",
                dateRange: {
                    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0],
                    end: new Date().toISOString().split("T")[0],
                },
                format: "pdf",
            });
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to create report");
        }
    };

    const handleDeleteReport = async (id) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                await deleteReport(id).unwrap();
                toast.success("Report deleted successfully");
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || "Failed to delete report");
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "processing":
                return <LoaderIcon className="w-5 h-5 text-red-500 animate-spin" />;
            case "failed":
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            completed: "text-green-500 bg-green-500/10 border-green-500/05",
            processing: "text-red-500 bg-red-500/10 border-red-500/05",
            failed: "text-red-500 bg-red-500/10 border-red-500/05",
            pending: "text-yellow-500 bg-yellow-500/10 border-yellow-500/05",
        };
        return colors[status] || colors.pending;
    };

    if (isLoading) return <PageSkeleton />;

    return (
        <AnimatedPage variant="fadeIn">
            <div className="min-h-screen bg-[#111112] text-white font-mono">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <motion.div
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div>
                            <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">
                                Repo<span className="text-red-500">rts</span>
                            </h1>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                GENERATE AND MANAGE THREAT INTELLIGENCE REPORTS
                            </p>
                        </div>
                        <motion.button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-red-500 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-red-500/50 transition-all flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="w-4 h-4" />
                            New Signal Report
                        </motion.button>
                    </motion.div>

                    {/* Reports Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {reports.length === 0 ? (
                                <motion.div
                                    className="col-span-full card-glass rounded-xl p-12 text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">NO REPORTS ARCHIVED</p>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all"
                                    >
                                        Create your first report
                                    </button>
                                </motion.div>
                            ) : (
                                reports.map((report, index) => (
                                    <motion.div
                                        key={report._id}
                                        className="card-glass rounded-xl p-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        layout
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-black uppercase tracking-tighter mb-2">
                                                    {report.title}
                                                </h3>
                                                <div
                                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(
                                                        report.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(report.status)}
                                                    {report.status}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-400 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(report.dateRange.start).toLocaleDateString()}{" "}
                                                    - {new Date(report.dateRange.end).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                <span className="uppercase">{report.format}</span>
                                            </div>
                                            {report.metadata?.incidentCount !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <Filter className="w-4 h-4" />
                                                    <span>{report.metadata.incidentCount} incidents</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                onClick={() => setSelectedReport(report)}
                                                className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDeleteReport(report._id)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-700 hover:text-red-400"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Create Report Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            className="card-glass rounded-xl p-8 max-w-md w-full border border-white/05 shadow-3xl"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Initialize Report</h2>
                            <form onSubmit={handleCreateReport} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                                        REPORT TITLE
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        className="w-full px-4 py-3 bg-[#111112] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-red-500/50 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                                        ANALYTIC TYPE
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) =>
                                            setFormData({ ...formData, type: e.target.value })
                                        }
                                        className="w-full px-4 py-3 bg-[#111112] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-red-500/50 transition-all appearance-none"
                                    >
                                        <option value="custom">CUSTOM</option>
                                        <option value="incident_summary">INCIDENT SUMMARY</option>
                                        <option value="threat_analysis">THREAT ANALYSIS</option>
                                        <option value="compliance">COMPLIANCE</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.dateRange.start}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    dateRange: {
                                                        ...formData.dateRange,
                                                        start: e.target.value,
                                                    },
                                                })
                                            }
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.dateRange.end}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    dateRange: {
                                                        ...formData.dateRange,
                                                        end: e.target.value,
                                                    },
                                                })
                                            }
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Format
                                    </label>
                                    <select
                                        value={formData.format}
                                        onChange={(e) =>
                                            setFormData({ ...formData, format: e.target.value })
                                        }
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="csv">CSV</option>
                                        <option value="json">JSON</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-3 bg-white/05 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50"
                                    >
                                        {isCreating ? "GENERATING..." : "GENERATE REPORT"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View Report Modal */}
            <AnimatePresence>
                {selectedReport && (
                    <ReportViewModal
                        report={selectedReport}
                        onClose={() => setSelectedReport(null)}
                    />
                )}
            </AnimatePresence>
        </AnimatedPage>
    );
};

// Report View Modal Component
const ReportViewModal = ({ report, onClose }) => {
    const { data, isLoading } = useGetReportDataQuery(report._id);

    return (
        <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="glass-dark rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{report.title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <LoaderIcon className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Loading report data...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-sm text-gray-400 mb-1">Total Incidents</p>
                                <p className="text-2xl font-bold">{data?.stats?.totalIncidents || 0}</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-sm text-gray-400 mb-1">Threat Types</p>
                                <p className="text-2xl font-bold">
                                    {Object.keys(data?.stats?.byType || {}).length}
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-sm text-gray-400 mb-1">Countries</p>
                                <p className="text-2xl font-bold">
                                    {Object.keys(data?.stats?.byCountry || {}).length}
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-sm text-gray-400 mb-1">Industries</p>
                                <p className="text-2xl font-bold">
                                    {Object.keys(data?.stats?.byIndustry || {}).length}
                                </p>
                            </div>
                        </div>

                        {/* Charts would go here */}
                        <div className="bg-white/5 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Threat Distribution</h3>
                            <div className="space-y-2">
                                {Object.entries(data?.stats?.byType || {}).map(([type, count]) => (
                                    <div key={type} className="flex items-center justify-between">
                                        <span className="text-gray-300">{type}</span>
                                        <span className="font-semibold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default Reports;
