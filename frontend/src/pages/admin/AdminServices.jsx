import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useGetServicesQuery,
    useGetServiceRequestsQuery,
    useUpdateServiceMutation,
    useUpdateServiceRequestMutation,
    useDeleteServiceMutation,
} from "../../redux/api/serviceApiSlice";
import AnimatedPage from "../../components/AnimatedPage";
import {
    Cpu,
    Zap,
    Activity,
    Shield,
    Terminal,
    Plus,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Search,
    ChevronDown,
    Trash2,
    Settings,
    MoreHorizontal
} from "lucide-react";
import { toast } from "react-toastify";

const AdminServices = () => {
    const [activeTab, setActiveTab] = useState("requests");
    const [searchTerm, setSearchTerm] = useState("");

    const { data: services = [], isLoading: loadingServices, refetch: refetchServices } = useGetServicesQuery();
    const { data: requests = [], isLoading: loadingRequests, refetch: refetchRequests } = useGetServiceRequestsQuery();

    const [updateRequest] = useUpdateServiceRequestMutation();
    const [deleteService] = useDeleteServiceMutation();

    const handleApproveRequest = async (id) => {
        try {
            await updateRequest({ id, status: "in_progress" }).unwrap();
            toast.success("PROTOCOL_DEPLOYMENT_AUTHORIZED");
            refetchRequests();
        } catch (error) {
            toast.error("AUTHORIZATION_FAILED");
        }
    };

    const handleDenyRequest = async (id) => {
        try {
            await updateRequest({ id, status: "rejected" }).unwrap();
            toast.success("PROTOCOL_ACCESS_REVOKED");
            refetchRequests();
        } catch (error) {
            toast.error("REVOCATION_FAILED");
        }
    };

    const handleDeleteService = async (id) => {
        if (window.confirm("CONFIRM_SERVICE_DECOMMISSIONING? THIS ACTION IS IRREVERSIBLE.")) {
            try {
                await deleteService(id).unwrap();
                toast.success("SERVICE_DECOMMISSIONED");
                refetchServices();
            } catch (error) {
                toast.error("DECOMMISSION_FAILED");
            }
        }
    };

    const stats = {
        activeRequests: requests.filter(r => r.status === 'pending').length,
        totalServices: services.length,
        systemLoad: "42%"
    };

    return (
        <AnimatedPage variant="fadeIn">
            <div className="space-y-8">
                {/* Tactical Header */}
                <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-12 border-b border-red-900/30 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-red-500">
                            <Cpu className="w-4 h-4 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Command_Authority_Level_4</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white glitch-text mb-4">
                            Service <span className="text-red-600">Control</span>
                        </h1>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                            Manage and deploy system-wide security protocols. Authorized personnel only.
                        </p>
                    </div>

                    {/* Hud Stats */}
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-red-950/20 border border-red-500/30 p-4 min-w-[140px]">
                            <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Active_Requests</div>
                            <div className="text-3xl font-black text-red-500">{stats.activeRequests}</div>
                        </div>
                        <div className="bg-[#0a0a0b] border border-red-900/30 p-4 min-w-[140px]">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Registered_Protocols</div>
                            <div className="text-3xl font-black text-white">{stats.totalServices}</div>
                        </div>
                    </div>
                </div>

                {/* Sub-Navigation */}
                <div className="flex gap-4 border-b border-red-900/10 mb-8">
                    {["requests", "registry"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? "text-red-500" : "text-gray-500 hover:text-white"
                                }`}
                        >
                            {tab === "requests" ? "PENDING_AUTHORIZATIONS" : "SERVICE_REGISTRY"}
                            {activeTab === tab && (
                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 shadow-[0_0_10px_#ef4444]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Main View Area */}
                <div className="space-y-4">
                    {activeTab === "requests" ? (
                        <div className="space-y-4">
                            {requests.length === 0 && !loadingRequests ? (
                                <div className="py-24 text-center border border-dashed border-red-900/20">
                                    <Activity className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                                    <div className="text-gray-500 text-xs uppercase tracking-[0.3em]">NO_PENDING_PROTOCOL_REQUESTS</div>
                                </div>
                            ) : (
                                requests.map((req, index) => (
                                    <motion.div
                                        key={req._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-black border border-white/5 hover:border-red-500/30 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`p-2 border ${req.urgency === 'critical' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>
                                                    <Shield size={16} />
                                                </div>
                                                <h3 className="text-xl font-black text-white uppercase tracking-wider truncate">
                                                    {req.service?.name || "UNKNOWN_SERVICE_ID"}
                                                </h3>
                                                <span className={`text-[8px] font-black px-2 py-0.5 border ${req.status === 'pending' ? 'border-orange-500 text-orange-500' :
                                                        req.status === 'in_progress' ? 'border-emerald-500 text-emerald-500' : 'border-gray-500 text-gray-500'
                                                    }`}>
                                                    {req.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wide mb-6">
                                                {req.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                                <div className="flex items-center gap-2">
                                                    <User size={12} className="text-red-500" />
                                                    <span>Requester: {req.user?.username || "ID_REDACTED"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} />
                                                    <span>Stamp: {new Date(req.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full md:w-auto">
                                            {req.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApproveRequest(req._id)}
                                                        className="flex-1 md:flex-none px-6 py-3 bg-red-600/10 hover:bg-emerald-500 text-red-500 hover:text-black border border-red-500/30 hover:border-emerald-500 text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Authorize
                                                    </button>
                                                    <button
                                                        onClick={() => handleDenyRequest(req._id)}
                                                        className="px-6 py-3 bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-600 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Revoke
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service, index) => (
                                <motion.div
                                    key={service._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-black border border-white/5 hover:border-red-500/50 p-8 relative group"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-500">
                                            <Zap size={24} />
                                        </div>
                                        <button
                                            onClick={() => handleDeleteService(service._id)}
                                            className="p-2 text-gray-700 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-[0.2em] mb-3">
                                        {service.name}
                                    </h3>
                                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">
                                        {service.description}
                                    </p>
                                    <div className="pt-6 border-t border-red-900/10 flex justify-between items-center text-[10px] font-black uppercase text-red-500 tracking-widest">
                                        <span>SEC_LEVEL: {service.category?.toUpperCase() || "ALPHA"}</span>
                                        <Settings size={14} className="cursor-pointer hover:rotate-90 transition-transform" />
                                    </div>
                                </motion.div>
                            ))}

                            <button className="bg-red-950/5 border-2 border-dashed border-red-900/20 hover:border-red-500/50 p-8 flex flex-col items-center justify-center gap-4 group transition-all">
                                <Plus size={32} className="text-gray-800 group-hover:text-red-500 transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 group-hover:text-white">Register_New_Protocol</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default AdminServices;
