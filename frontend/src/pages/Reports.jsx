import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
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
    BarChart,
    PieChart as PieChartIcon,
    Activity,
    Target,
    Zap,
    Globe,
    Shield,
    Terminal
} from "lucide-react";
import { toast } from "react-toastify";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';

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
            toast.success("INTEL_GENERATION_INITIATED");
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
            toast.error(error?.data?.message || "GENERATION_FAILED");
        }
    };

    const handleDeleteReport = async (id) => {
        if (window.confirm("CONFIRM_DESTRUCTION: Purge intel record?")) {
            try {
                await deleteReport(id).unwrap();
                toast.success("INTEL_PURGED");
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || "PURGE_FAILED");
            }
        }
    };

    const quickGenerate = (type) => {
        const titles = {
            incident_summary: "FLASH_INCIDENT_SUMMARY",
            threat_analysis: "THREAT_VECTOR_ANALYSIS",
            compliance: "COMPLIANCE_AUDIT_LOG"
        };
        setFormData({
            ...formData,
            title: `${titles[type]}_${new Date().toLocaleDateString().replace(/\//g, '-')}`,
            type: type
        });
        setShowCreateModal(true);
    };

    return (
        <AnimatedPage variant="fadeIn">
            <div className="min-h-screen bg-[#050506] text-white font-mono relative overflow-hidden">
                {/* Cyber Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-12 border-b border-red-900/30 pb-8">
                        <div>
                            <div className="flex items-center gap-3 text-red-500 mb-2">
                                <Target className="w-6 h-6 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">Strategic_Intelligence_Hub</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white glitch-text mb-4">
                                Threat <span className="text-red-600">Analytics</span>
                            </h1>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => quickGenerate('incident_summary')} className="px-4 py-8 bg-[#0a0a0b] border border-red-900/30 hover:border-red-500/50 hover:bg-red-900/10 transition-all group flex flex-col items-center gap-2 min-w-[100px]">
                                <Activity className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white">Flash_Sum</span>
                            </button>
                            <button onClick={() => quickGenerate('threat_analysis')} className="px-4 py-8 bg-[#0a0a0b] border border-red-900/30 hover:border-red-500/50 hover:bg-red-900/10 transition-all group flex flex-col items-center gap-2 min-w-[100px]">
                                <Radar className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white">Vector_Ana</span>
                            </button>
                            <button onClick={() => setShowCreateModal(true)} className="px-4 py-8 bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all group flex flex-col items-center gap-2 min-w-[120px]">
                                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">New_Intel</span>
                            </button>
                        </div>
                    </div>

                    {/* Reports Grid */}
                    {isLoading ? (
                        <PageSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {reports.length === 0 ? (
                                    <div className="col-span-full border border-dashed border-red-900/30 rounded-xl p-24 flex flex-col items-center justify-center text-center">
                                        <FileText className="w-16 h-16 text-red-900 mb-6" />
                                        <h3 className="text-xl font-bold uppercase tracking-widest text-gray-500 mb-2">No Intelligence Artifacts</h3>
                                        <p className="text-gray-600 text-xs font-mono uppercase tracking-widest mb-8">Initialize collection protocol to generate data.</p>
                                    </div>
                                ) : (
                                    reports.map((report, index) => (
                                        <motion.div
                                            key={report._id}
                                            className="group bg-[#0a0a0b] border border-red-900/20 hover:border-red-500/50 p-6 transition-all duration-300 relative overflow-hidden"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            {/* Hover Glow */}
                                            <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className={`p-3 border ${report.status === 'completed' ? 'border-red-500 text-red-500 bg-red-900/10' : 'border-gray-700 text-gray-500'}`}>
                                                        {report.type === 'threat_analysis' ? <Radar className="w-6 h-6" /> :
                                                            report.type === 'compliance' ? <Shield className="w-6 h-6" /> :
                                                                <BarChart className="w-6 h-6" />}
                                                    </div>
                                                    <div className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest border ${report.status === 'completed' ? 'border-emerald-500 text-emerald-500' :
                                                        report.status === 'failed' ? 'border-red-500 text-red-500' :
                                                            'border-yellow-500 text-yellow-500'
                                                        }`}>
                                                        {report.status}
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-2 truncate group-hover:text-red-500 transition-colors">
                                                    {report.title}
                                                </h3>

                                                <div className="grid grid-cols-2 gap-4 my-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                    <div>
                                                        <div className="text-red-900 mb-1">Range_Start</div>
                                                        <div className="text-gray-300">{new Date(report.dateRange.start).toLocaleDateString()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-red-900 mb-1">Range_End</div>
                                                        <div className="text-gray-300">{new Date(report.dateRange.end).toLocaleDateString()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-red-900 mb-1">Format</div>
                                                        <div className="text-gray-300">{report.format}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-red-900 mb-1">Incidents</div>
                                                        <div className="text-gray-300">{report.metadata?.incidentCount || 0}</div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedReport(report)}
                                                        disabled={report.status !== 'completed'}
                                                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Eye className="w-3 h-3" /> Execute
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReport(report._id)}
                                                        className="p-3 bg-red-900/10 hover:bg-red-900/30 text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Report Modal */}
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
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-[#0a0a0b] border border-red-600 w-full max-w-lg shadow-[0_0_50px_rgba(220,38,38,0.2)]"
                        >
                            <div className="bg-red-600 p-1 flex justify-between items-center px-4 py-2">
                                <span className="text-black text-xs font-black uppercase tracking-widest">Initial_Intel_Protocol</span>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-black rounded-full" />
                                    <div className="w-2 h-2 bg-black/50 rounded-full" />
                                </div>
                            </div>

                            <form onSubmit={handleCreateReport} className="p-8 space-y-6">
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Operation_Codename</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-[#111] border border-red-900/30 p-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                                        placeholder="ENTER_CODENAME..."
                                        autoComplete="off"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Start_Vector</label>
                                        <input
                                            type="date"
                                            value={formData.dateRange.start}
                                            onChange={(e) => setFormData({ ...formData, dateRange: { ...formData.dateRange, start: e.target.value } })}
                                            className="w-full bg-[#111] border border-red-900/30 p-3 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">End_Vector</label>
                                        <input
                                            type="date"
                                            value={formData.dateRange.end}
                                            onChange={(e) => setFormData({ ...formData, dateRange: { ...formData.dateRange, end: e.target.value } })}
                                            className="w-full bg-[#111] border border-red-900/30 p-3 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Analytic_Module</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-[#111] border border-red-900/30 p-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-500"
                                    >
                                        <option value="custom">CUSTOM_QUERY</option>
                                        <option value="incident_summary">INCIDENT_SUMMARY</option>
                                        <option value="threat_analysis">THREAT_VECTOR_ANALYSIS</option>
                                        <option value="compliance">COMPLIANCE_AUDIT</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white uppercase font-black text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2"
                                >
                                    {isCreating ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                    {isCreating ? "GENERATING_ARTIFACT..." : "INITIATE_GENERATION"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* View Report Modal (Advanced) */}
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

// Advanced Report View Modal Component
const ReportViewModal = ({ report, onClose }) => {
    const { data: reportData, isLoading } = useGetReportDataQuery(report._id);

    // Transform data for charts
    const typeData = reportData ? Object.entries(reportData.stats.byType).map(([name, value]) => ({ name, value })) : [];
    const countryData = reportData ? Object.entries(reportData.stats.byCountry).map(([name, value]) => ({ subject: name, A: value, fullMark: 10 })) : [];
    const COLORS = ['#ef4444', '#b91c1c', '#7f1d1d', '#500707', '#991b1b'];

    return (
        <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-[#050506] border border-red-600/50 w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(220,38,38,0.1)] relative"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-red-600/10 border-b border-red-600/30 p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <Terminal className="w-6 h-6 text-red-500" />
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight text-white">{report.title}</h2>
                            <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                                ID: {report._id} | {new Date(report.createdAt).toISOString()}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <Trash2 className="w-6 h-6 rotate-45" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center flex-col gap-4">
                        <LoaderIcon className="w-12 h-12 text-red-500 animate-spin" />
                        <div className="text-xs font-bold uppercase tracking-widest text-red-500 animate-pulse">Decrypting_Intel_Data...</div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'Total_Incidents', value: reportData?.stats?.totalIncidents || 0, icon: Activity },
                                { label: 'Threat_Types', value: Object.keys(reportData?.stats?.byType || {}).length, icon: Shield },
                                { label: 'Geo_Locations', value: Object.keys(reportData?.stats?.byCountry || {}).length, icon: Globe },
                                { label: 'Industries', value: Object.keys(reportData?.stats?.byIndustry || {}).length, icon: Target },
                            ].map((stat, i) => (
                                <div key={i} className="bg-red-900/5 border border-red-900/30 p-6 relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                        <stat.icon className="w-12 h-12" />
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{stat.label}</div>
                                    <div className="text-4xl font-black text-white">{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[400px]">
                            {/* Radar Chart for Vectors */}
                            <div className="bg-[#0a0a0b] border border-red-900/20 p-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                                    <Radar className="w-4 h-4" /> Global_Threat_Vectors
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={countryData}>
                                            <PolarGrid stroke="#333" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#333" />
                                            <Radar
                                                name="Incidents"
                                                dataKey="A"
                                                stroke="#ef4444"
                                                strokeWidth={2}
                                                fill="#ef4444"
                                                fillOpacity={0.3}
                                            />
                                            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Pie Chart for Types */}
                            <div className="bg-[#0a0a0b] border border-red-900/20 p-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                                    <PieChartIcon className="w-4 h-4" /> Anomaly_Distribution
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={typeData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {typeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }}
                                                itemStyle={{ color: '#fff', fontSize: '12px' }}
                                            />
                                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default Reports;
