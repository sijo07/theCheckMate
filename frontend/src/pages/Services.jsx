import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useGetServicesQuery,
    useCreateServiceRequestMutation,
} from "../redux/api/serviceApiSlice";
import AnimatedPage from "../components/AnimatedPage";
import { CardSkeleton } from "../components/LoadingSkeleton";
import {
    Search,
    Shield,
    Star,
    Clock,
    DollarSign,
    CheckCircle,
    Send,
    Package,
    Terminal,
    Lock,
    Cpu,
    Activity,
    AlertTriangle,
    Database,
    Globe
} from "lucide-react";
import { toast } from "react-toastify";

const Services = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);

    const { data: services, isLoading } = useGetServicesQuery({
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
                serviceId: selectedService._id,
                status: 'pending' // Default stat
            }).unwrap();

            toast.success(`PROTOCOL_INITIATED: ${selectedService.name.toUpperCase()}`);
            setShowRequestModal(false);
        } catch (error) {
            toast.error(error?.data?.message || "INITIATION_FAILED");
        }
    };

    return (
        <AnimatedPage variant="fadeIn">
            <div className="min-h-screen bg-[#050506] text-white font-mono relative overflow-hidden">
                {/* Background Cyber Grid & Laser - Keeping existing code... */}
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b border-red-900/30 pb-8">
                        <div>
                            <div className="flex items-center gap-3 text-red-500 mb-2">
                                <Shield className="w-6 h-6 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">Global_Sec_Ops</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white glitch-text mb-4">
                                Advanced <span className="text-red-600">Defense</span>
                            </h1>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest max-w-lg leading-relaxed">
                                Deploy offensive and defensive cyber capabilities. Select a protocol to initiate security countermeasures.
                            </p>
                        </div>

                        {/* Stats HUD */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-red-900/10 border border-red-900/30 p-4 min-w-[140px]">
                                <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Active_Threats</div>
                                <div className="text-2xl font-black text-white">4,092</div>
                            </div>
                            <div className="bg-red-900/10 border border-red-900/30 p-4 min-w-[140px]">
                                <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">System_Status</div>
                                <div className="text-2xl font-black text-emerald-500">SECURE</div>
                            </div>
                        </div>
                    </div>

                    {/* Command Bar */}
                    <div className="bg-[#0a0a0b] border border-red-900/30 p-1 mb-12 flex flex-col md:flex-row items-stretch">
                        <div className="flex-1 flex items-center relative border-b md:border-b-0 md:border-r border-red-900/30">
                            <Terminal className="absolute left-4 w-5 h-5 text-red-500" />
                            <input
                                type="text"
                                placeholder="SEARCH_PROTOCOLS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoComplete="off"
                                className="w-full bg-transparent text-white text-xs font-bold uppercase tracking-widest py-4 pl-12 focus:outline-none placeholder-gray-700"
                            />
                        </div>
                        <div className="flex items-center px-2">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="bg-transparent text-red-500 text-xs font-bold uppercase tracking-widest py-2 px-4 focus:outline-none cursor-pointer hover:bg-red-900/10 rounded transition-colors"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value} className="bg-[#0a0a0b] text-gray-400">
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Services Grid */}
                    {isLoading ? (
                        <CardSkeleton count={6} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {services?.map((service, index) => (
                                    <motion.div
                                        key={service._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-[#0a0a0b] border border-red-900/20 hover:border-red-500/50 group relative overflow-hidden transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        <div className="h-1 w-full bg-gradient-to-r from-red-600/0 via-red-600/50 to-red-600/0 opacity-50" />

                                        <div className="p-8">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-3 bg-red-900/10 border border-red-500/20 group-hover:scale-110 transition-transform duration-300">
                                                    <Lock className="w-6 h-6 text-red-500" />
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">SEC_LEVEL_{Math.floor(service.rating.average)}</div>
                                                    <div className="flex items-center justify-end gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <div key={i} className={`w-1 h-1 rounded-full ${i < Math.floor(service.rating.average) ? 'bg-red-500' : 'bg-gray-800'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-black uppercase tracking-wider text-white mb-3 group-hover:text-red-500 transition-colors">
                                                {service.name}
                                            </h3>
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wide leading-relaxed mb-6 line-clamp-3">
                                                {service.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-px bg-red-900/20 border border-red-900/20 mb-6">
                                                <div className="bg-[#0a0a0b] p-3 text-center">
                                                    <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Cost_Basis</div>
                                                    <div className="text-xs font-bold text-white">
                                                        {service.pricing?.type === "fixed" ? `$${service.pricing.amount}` : "CUSTOM"}
                                                    </div>
                                                </div>
                                                <div className="bg-[#0a0a0b] p-3 text-center">
                                                    <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Est_Time</div>
                                                    <div className="text-xs font-bold text-white">
                                                        {service.duration ? `${service.duration.value} ${service.duration.unit}` : "VARIES"}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleRequestService(service)}
                                                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                            >
                                                <Terminal className="w-4 h-4" />
                                                Deploy_Protocol
                                            </button>
                                        </div>

                                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500/50" />
                                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500/50" />
                                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500/50" />
                                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500/50" />
                                    </motion.div>
                                ))}

                                {!isLoading && services?.length === 0 && (
                                    <div className="col-span-full py-20 text-center border border-red-900/30 bg-[#0a0a0b]">
                                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
                                        <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">No_Protocols_Found</h3>
                                        <p className="text-gray-500 text-xs uppercase tracking-widest">Adjust search parameters or clear filters.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Tactical Request Modal */}
                <AnimatePresence>
                    {showRequestModal && selectedService && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowRequestModal(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-[#0a0a0b] border border-red-600 w-full max-w-lg shadow-[0_0_50px_rgba(220,38,38,0.2)]"
                            >
                                <div className="p-1 bg-red-600 flex justify-between items-center text-black px-4 py-2 mb-4">
                                    <span className="text-xs font-black uppercase tracking-widest">Protocol_Authorization</span>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-black rounded-full" />
                                        <div className="w-2 h-2 bg-black/50 rounded-full" />
                                    </div>
                                </div>

                                <div className="p-8 pt-2">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-4 bg-red-900/20 border border-red-600/30">
                                            <AlertTriangle className="w-8 h-8 text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">
                                                Confirm Deployment
                                            </h3>
                                            <p className="text-red-400 text-xs font-bold uppercase tracking-widest">
                                                Auth_Key: {selectedService._id.slice(-8).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="bg-[#111] p-4 border border-white/10">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Target_Protocol</div>
                                            <div className="text-white font-bold">{selectedService.name}</div>
                                        </div>
                                        <div className="bg-[#111] p-4 border border-white/10">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Cost_Impact</div>
                                            <div className="text-white font-bold">
                                                {selectedService.pricing?.amount ? `$${selectedService.pricing.amount}` : "Dynamic_Quotation"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setShowRequestModal(false)}
                                            className="flex-1 py-4 border border-gray-700 text-gray-300 hover:bg-white/5 uppercase font-bold text-xs tracking-widest transition-colors"
                                        >
                                            Abort
                                        </button>
                                        <button
                                            onClick={confirmRequest}
                                            className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white uppercase font-black text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
                                        >
                                            Initiate
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </AnimatedPage>
    );
};

export default Services;
