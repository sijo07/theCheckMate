import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation, useChangePasswordMutation } from "../redux/api/userApiSlice";
import { logout } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Shield,
    Cpu,
    Terminal,
    Activity,
    Lock,
    Download,
    LogOut,
    ToggleLeft,
    ToggleRight
} from "lucide-react";

const Settings = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();
    const [changePassword, { isLoading: isPasswordLoading }] = useChangePasswordMutation();

    const [activeTab, setActiveTab] = useState("protocols");

    // Notification State (Signal Protocols)
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        critical: true,
        warning: true,
        info: false,
    });

    // Password State (Security Matrix)
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleNotificationToggle = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
        toast.info(`PROTOCOL_${key.toUpperCase()}_${!notifications[key] ? 'ENGAGED' : 'TERMINATED'}`);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("CIPHER_MISMATCH_DETECTED");
            return;
        }
        try {
            await changePassword({
                _id: userInfo._id,
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            }).unwrap();
            toast.success("SECURITY_MATRIX_UPDATED");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleDataExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userInfo, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `AGENT_${userInfo.username}_MANIFEST.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast.success("MANIFEST_EXPORT_COMPLETE");
    };

    const handleLogout = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate("/login");
            toast.warning("CONNECTION_TERMINATED");
        } catch (error) {
            console.error(error);
        }
    };

    const tabs = [
        { id: "protocols", label: "Signal_Protocols", icon: Activity, desc: "Manage communication streams" },
        { id: "security", label: "Security_Matrix", icon: Shield, desc: "Cipher & Access Controls" },
        { id: "system", label: "System_Core", icon: Cpu, desc: "Advanced System Operations" },
    ];

    return (
        <div className="min-h-screen bg-[#050506] text-white font-mono relative overflow-hidden flex items-start justify-center p-4">
            {/* Background Cyber Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(185, 28, 28, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(185, 28, 28, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
            {/* Scanning Line */}
            <motion.div
                className="absolute left-0 right-0 h-1 bg-red-600/10 z-0 pointer-events-none shadow-[0_0_20px_#ef4444]"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10 w-full max-w-6xl h-[80vh] grid grid-cols-1 md:grid-cols-12 gap-0 border border-red-900/30 bg-[#0a0a0b]/90 backdrop-blur-sm">

                {/* Sidebar Navigation */}
                <div className="md:col-span-3 border-r border-red-900/30 flex flex-col">
                    <div className="p-6 border-b border-red-900/30 bg-red-900/5">
                        <div className="flex items-center gap-3 text-red-500 mb-1">
                            <Terminal className="w-5 h-5" />
                            <span className="font-bold tracking-widest uppercase">Sys_Config</span>
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest pl-8">V.2.0.44</div>
                    </div>

                    <div className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left p-4 group relative overflow-hidden transition-all ${isActive ? "bg-red-900/20 text-white" : "text-gray-500 hover:text-red-400 hover:bg-red-900/5"
                                        }`}
                                >
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />}
                                    <div className="flex items-center gap-3 relative z-10">
                                        <Icon className={`w-5 h-5 ${isActive ? "text-red-500" : "text-gray-600"}`} />
                                        <div>
                                            <div className="text-sm font-bold uppercase tracking-wider">{tab.label}</div>
                                            <div className="text-[10px] opacity-60 hidden md:block">{tab.desc}</div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-9 p-8 relative overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {/* Header */}
                            <div className="mb-8 flex items-end gap-4 border-b border-red-900/20 pb-4">
                                <h2 className="text-3xl font-black uppercase text-white tracking-widest">
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h2>
                                <span className="text-red-500/50 font-mono text-xs mb-2">
                                    // {tabs.find(t => t.id === activeTab)?.desc}
                                </span>
                            </div>

                            {/* Signal Protocols (Notifications) */}
                            {activeTab === "protocols" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(notifications).map(([key, value]) => (
                                        <div key={key} className="bg-white/05 border border-red-900/20 p-4 flex items-center justify-between group hover:border-red-500/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-900'}`} />
                                                <span className="uppercase text-sm tracking-widest text-gray-300 group-hover:text-white transition-colors">
                                                    {key}_Stream
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleNotificationToggle(key)}
                                                className="text-red-500 hover:text-red-400 transition-colors"
                                            >
                                                {value ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 opacity-50" />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Security Matrix (Password) */}
                            {activeTab === "security" && (
                                <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                                    <div className="group">
                                        <label className="text-[10px] text-red-500/70 uppercase tracking-wider mb-1 block">Current_Cipher</label>
                                        <div className="relative">
                                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                                            <input
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="w-full bg-transparent border-b border-red-900/30 py-2 pl-8 text-white font-mono focus:outline-none focus:border-red-500 transition-colors placeholder-gray-700"
                                                placeholder="ENTER_CURRENT_CIPHER"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] text-red-500/70 uppercase tracking-wider mb-1 block">New_Cipher_Protocol</label>
                                        <div className="relative">
                                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full bg-transparent border-b border-red-900/30 py-2 pl-8 text-white font-mono focus:outline-none focus:border-red-500 transition-colors placeholder-gray-700"
                                                placeholder="ENTER_NEW_CIPHER"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] text-red-500/70 uppercase tracking-wider mb-1 block">Verify_Cipher_Protocol</label>
                                        <div className="relative">
                                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full bg-transparent border-b border-red-900/30 py-2 pl-8 text-white font-mono focus:outline-none focus:border-red-500 transition-colors placeholder-gray-700"
                                                placeholder="CONFIRM_NEW_CIPHER"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isPasswordLoading}
                                        className="w-full bg-red-900/20 border border-red-600 text-red-500 py-3 uppercase tracking-widest text-xs font-bold hover:bg-red-600 hover:text-white transition-all group relative overflow-hidden flex items-center justify-center gap-2"
                                    >
                                        <Shield className="w-4 h-4" />
                                        {isPasswordLoading ? "ENCRYPTING..." : "UPDATE_SECURITY_MATRIX"}
                                    </button>
                                </form>
                            )}

                            {/* System Core (Advanced) */}
                            {activeTab === "system" && (
                                <div className="space-y-8">
                                    <div className="bg-red-900/10 border border-red-900/30 p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/10 rounded-bl-full" />
                                        <h3 className="text-xl font-bold uppercase text-white mb-2 flex items-center gap-2">
                                            <Download className="w-5 h-5 text-red-500" />
                                            Data_Manifest_Export
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 max-w-lg">
                                            Extract a complete raw JSON dump of your current identity profile and system configurations.
                                        </p>
                                        <button
                                            onClick={handleDataExport}
                                            className="px-6 py-2 bg-white/05 hover:bg-white/10 border border-white/10 hover:border-white/30 text-xs font-bold uppercase tracking-widest transition-all"
                                        >
                                            Iniate_Download
                                        </button>
                                    </div>

                                    <div className="border-t border-red-900/30 pt-8">
                                        <h3 className="text-lg font-bold uppercase text-red-500 mb-4 flex items-center gap-2">
                                            <Terminal className="w-5 h-5" />
                                            System_Log_Stream
                                        </h3>
                                        <div className="h-48 bg-black/50 border border-red-900/20 p-4 font-mono text-xs text-green-500/70 overflow-y-auto custom-scrollbar space-y-1">
                                            <div>[SYSTEM_INIT] Core Services Online...</div>
                                            <div>[NET_CHECK] Connection Stable (Ping: 14ms)</div>
                                            <div>[AUTH_VERIFY] Token Validated for User: {userInfo.username}</div>
                                            <div className="text-yellow-500/70">[WARN] Legacy Protocol Detected in Sector 7</div>
                                            <div>[SYNC] Cloud Database Synced</div>
                                            <div>[SEC_AUDIT] Password Strength: OPTIMAL</div>
                                            <div>[ENV] Mode: TACTICAL_DARK</div>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex justify-end">
                                        <button
                                            onClick={handleLogout}
                                            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Terminate_Session
                                        </button>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Settings;
