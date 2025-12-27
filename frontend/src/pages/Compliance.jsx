import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, FileText, ChevronRight, AlertTriangle, Eye, Server, Activity } from "lucide-react";

const Compliance = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || "privacy");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
    }, [location.state]);

    const documents = {
        privacy: {
            title: "Privacy Policy",
            code: "DOC-772-P",
            icon: Eye,
            content: (
                <article className="space-y-6 text-gray-300 font-mono text-sm leading-relaxed">
                    <h2 className="text-xl text-white font-bold uppercase tracking-wider mb-4 border-b border-red-500/30 pb-2">
                        1. Data Collection & Surveillance
                    </h2>
                    <p>
                        CheckMate Security Systems automatically harvests telemetry data from all connected nodes.
                        By utilizing this interface, you consent to the active monitoring of your network traffic patterns,
                        threat signatures, and system diagnostics.
                    </p>
                    <div className="bg-red-900/10 border-l-2 border-red-500 p-4 my-4">
                        <strong className="text-red-400 text-xs uppercase tracking-widest block mb-1">Warning: Zero-Log Voids</strong>
                        <p className="text-xs">
                            While we operate on a strict need-to-know basis, critical threat vectors are archived indefinitely
                            in the Global Threat Database (GTD) for heuristic analysis.
                        </p>
                    </div>

                    <h2 className="text-xl text-white font-bold uppercase tracking-wider mb-4 border-b border-red-500/30 pb-2">
                        2. Encryption Standards
                    </h2>
                    <p>
                        All user data is encrypted at rest using AES-256-GCM. Transmission occurs over TLS 1.3 tunnels.
                        We do not hold the keys to your private enclaves. If you lose your credentials,
                        data recovery is mathematically impossible.
                    </p>
                </article>
            )
        },
        terms: {
            title: "Terms of Service",
            code: "DOC-991-T",
            icon: FileText,
            content: (
                <article className="space-y-6 text-gray-300 font-mono text-sm leading-relaxed">
                    <h2 className="text-xl text-white font-bold uppercase tracking-wider mb-4 border-b border-red-500/30 pb-2">
                        1. Authorized Use
                    </h2>
                    <p>
                        The CheckMate platform is a defensive weapon. Any attempt to use our tools for offensive cyber operations,
                        unauthorized penetration testing without consent, or grey-hat activities will result in immediate
                        termination of service and referral to relevant cyber-authorities.
                    </p>

                    <h2 className="text-xl text-white font-bold uppercase tracking-wider mb-4 border-b border-red-500/30 pb-2">
                        2. Liability Disclaimer
                    </h2>
                    <p>
                        In the event of a catastrophic cyber-breach, CheckMate's autonomous remediation systems will attempt to
                        neutralize the threat. However, we are not liable for zero-day exploits that bypass current heuristic models.
                    </p>
                </article>
            )
        },
        sla: {
            title: "SLA Agreement",
            code: "DOC-101-S",
            icon: Server,
            content: (
                <article className="space-y-6 text-gray-300 font-mono text-sm leading-relaxed">
                    <h2 className="text-xl text-white font-bold uppercase tracking-wider mb-4 border-b border-red-500/30 pb-2">
                        Service Level Commitment
                    </h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong className="text-white">Uptime Guarantee:</strong> 99.99% via specialized redundant nodes.</li>
                        <li><strong className="text-white">Response Time:</strong> Critical incidents triggered within 50ms.</li>
                        <li><strong className="text-white">Support:</strong> 24/7 dedicated encrypted channel access.</li>
                    </ul>
                </article>
            )
        },
        audit: {
            title: "Security Audit",
            code: "DOC-AUD-00",
            icon: Shield,
            content: (
                <article className="space-y-6 text-gray-300 font-mono text-sm leading-relaxed">
                    <h2 className="text-xl text-white font-bold uppercase tracking-wider mb-4 border-b border-red-500/30 pb-2">
                        Last Audit: 2024-Q4
                    </h2>
                    <p>
                        Audited by <span className="text-red-400">SpectreSec Global</span>.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-white/5 p-4 rounded border border-white/10">
                            <span className="block text-xs uppercase text-gray-500">Penetration Test</span>
                            <span className="block text-lg font-bold text-green-500">PASSED</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded border border-white/10">
                            <span className="block text-xs uppercase text-gray-500">Code Integrity</span>
                            <span className="block text-lg font-bold text-green-500">100%</span>
                        </div>
                    </div>
                </article>
            )
        }
    };

    const ActiveIcon = documents[activeTab].icon;

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 relative overflow-hidden">
            {/* Background Mesh */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="mb-12 border-b border-white/10 pb-6 flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Lock className="w-5 h-5 text-red-500" />
                            <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500">Restricted Access // Level 4</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                            Compliance <span className="text-red-600">Matrix</span>
                        </h1>
                    </div>
                    <div className="hidden md:block text-right">
                        <span className="block text-[10px] text-gray-500 font-mono uppercase">Document_ID</span>
                        <span className="block text-xl font-mono text-white">{documents[activeTab].code}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3 space-y-2">
                        {Object.entries(documents).map(([key, doc]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`w-full text-left px-4 py-4 rounded border transition-all relative group overflow-hidden ${activeTab === key
                                    ? "bg-red-600 text-white border-red-500"
                                    : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:border-white/10"
                                    }`}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <doc.icon className={`w-4 h-4 ${activeTab === key ? "text-white" : "text-gray-500 group-hover:text-red-400"}`} />
                                        <span className="text-xs font-bold uppercase tracking-wider">{doc.title}</span>
                                    </div>
                                    {activeTab === key && <ChevronRight className="w-4 h-4" />}
                                </div>
                                {activeTab !== key && (
                                    <motion.div
                                        className="absolute inset-0 bg-red-600/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
                                    />
                                )}
                            </button>
                        ))}

                        <div className="mt-8 p-4 bg-red-900/10 border border-red-500/20 rounded">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                <div>
                                    <h4 className="text-red-500 text-xs font-bold uppercase mb-1">Legal Disclaimer</h4>
                                    <p className="text-[10px] text-gray-400 leading-normal">
                                        These documents are legally binding upon connection to the network. Failure to comply triggers automatic termination.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-lg p-8 md:p-12 relative overflow-hidden"
                        >
                            {/* Decorative Document Elements */}
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <div className="w-24 h-24 border-t-2 border-r-2 border-red-500/20 rounded-tr-3xl" />
                            </div>
                            <div className="absolute bottom-0 left-0 p-4 opacity-50">
                                <div className="w-24 h-24 border-b-2 border-l-2 border-red-500/20 rounded-bl-3xl" />
                            </div>

                            {/* Watermark */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]">
                                <Shield className="w-96 h-96" />
                            </div>

                            {/* Content Header */}
                            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                                    <ActiveIcon className="w-6 h-6 text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white uppercase">{documents[activeTab].title}</h2>
                                    <span className="text-xs font-mono text-gray-500">Last Revised: 2024-12-01 // Ver 2.4.1</span>
                                </div>
                            </div>

                            {/* Dynamic Content */}
                            <div className="relative z-10">
                                {documents[activeTab].content}
                            </div>

                            {/* Signature Block */}
                            <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-end">
                                <div className="font-mono text-[10px] text-gray-600">
                                    <p>APPROVED BY:</p>
                                    <p className="text-gray-400 text-lg font-signature mt-1 italic">Director J. Doe</p>
                                </div>
                                <div className="w-24 h-24 border-2 border-red-900/30 rounded-full flex items-center justify-center rotate-[-15deg] opacity-70">
                                    <div className="text-center">
                                        <span className="block text-[8px] text-red-800 font-bold uppercase">CheckMate</span>
                                        <span className="block text-[10px] text-red-700 font-black uppercase tracking-widest">Seal of Trust</span>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compliance;
