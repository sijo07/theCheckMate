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
        { value: "", label: "All Services" },
        { value: "threat_analysis", label: "Threat Analysis" },
        { value: "vulnerability_assessment", label: "Vulnerability Assessment" },
        { value: "penetration_testing", label: "Penetration Testing" },
        { value: "security_audit", label: "Security Audit" },
        { value: "incident_response", label: "Incident Response" },
        { value: "compliance_consulting", label: "Compliance Consulting" },
        { value: "security_training", label: "Security Training" },
        { value: "managed_security", label: "Managed Security" },
    ];

    const handleRequestService = (service) => {
        setSelectedService(service);
        setShowRequestModal(true);
    };

    return (
        <AnimatedPage variant="fadeIn">
            <div className="min-h-screen bg-[#111112] text-white font-mono">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-black mb-1 uppercase tracking-tighter text-white">
                                Security <span className="text-red-500">Services</span>
                            </h1>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                PROFESSIONAL CYBER DEFENSE SOLUTIONS
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-glass rounded-xl p-6 mb-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                                <input
                                    type="text"
                                    placeholder="SEARCH SERVICES ARCHIVE..."
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
                        </div>
                    </motion.div>

                    {/* Services Grid */}
                    {isLoading ? (
                        <CardSkeleton count={6} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {services?.map((service, index) => (
                                    <motion.div
                                        key={service._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="card-glass rounded-xl p-6 hover:shadow-orange-500/05 transition-all group border border-white/05"
                                    >
                                        {/* Icon */}
                                        <div className="mb-6 flex justify-between items-start">
                                            <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Shield className="w-6 h-6 text-red-500" />
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center space-x-1 text-[10px] font-black text-red-500 uppercase tracking-widest">
                                                    <Star className="w-3 h-3 fill-red-500" />
                                                    <span>{service.rating.average.toFixed(1)}</span>
                                                </div>
                                                <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">{service.rating.count} REVIEWS</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-2">
                                            {service.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                            {service.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            {service.pricing && (
                                                <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-white/03 border border-white/05">
                                                    <DollarSign className="w-3 h-3 text-red-500" />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        {service.pricing.type === "fixed"
                                                            ? `$${service.pricing.amount}`
                                                            : service.pricing.type === "hourly"
                                                                ? `$${service.pricing.amount}/HR`
                                                                : service.pricing.type === "monthly"
                                                                    ? `$${service.pricing.amount}/MO`
                                                                    : "CUSTOM"}
                                                    </span>
                                                </div>
                                            )}
                                            {service.duration && (
                                                <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-white/03 border border-white/05">
                                                    <Clock className="w-3 h-3 text-gray-500" />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        {service.duration.value} {service.duration.unit.toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Features */}
                                        {service.features && service.features.length > 0 && (
                                            <div className="mb-8 space-y-2">
                                                {service.features.slice(0, 3).map((feature, idx) => (
                                                    <div key={idx} className="flex items-start space-x-3">
                                                        <CheckCircle className="w-3 h-3 text-red-500 mt-1 flex-shrink-0" />
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Request Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleRequestService(service)}
                                            className="w-full px-4 py-4 bg-red-500 text-white rounded-lg text-xs font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-red-500/40 transition-all flex items-center justify-center space-x-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            <span>Initialize Signal</span>
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && services?.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24"
                        >
                            <Package className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-700 mb-2">
                                Archive Empty
                            </h3>
                            <p className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">
                                SIGNAL REPOSITORY IS CURRENTLY OFFLINE
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Services;
