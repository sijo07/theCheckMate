import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useChangePasswordMutation, useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/authSlice";
import {
    Terminal,
    Database,
    Settings,
    Lock,
    Globe,
    Shield,
    Zap,
    Activity,
    Cpu,
    Server
} from "lucide-react";
import AnimatedPage from "../../components/AnimatedPage";

const CyberCard = ({ children, className = "", title, icon: Icon }) => (
    <div className={`relative bg-black border border-red-900/20 p-6 md:p-8 overflow-hidden group ${className}`}>
        <div className="absolute top-0 left-0 w-1 h-1 bg-red-500" />
        <div className="absolute top-0 right-0 w-1 h-1 bg-red-500" />
        <div className="absolute bottom-0 left-0 w-1 h-1 bg-red-500" />
        <div className="absolute bottom-0 right-0 w-1 h-1 bg-red-500" />

        {(title || Icon) && (
            <div className="flex items-center gap-3 mb-6 border-b border-red-900/10 pb-4">
                {Icon && <Icon className="w-5 h-5 text-red-500" />}
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                    {title}
                </h3>
            </div>
        )}
        {children}
    </div>
);

export const AdminLogs = () => {
    const logs = [
        { time: "22:45:12", user: "ADMIN_ALPHA", action: "NEXUS_ACCESS", status: "SUCCESS", ip: "10.0.4.122" },
        { time: "22:48:05", user: "SYS_KERNEL", action: "RESOURCE_SYNC", status: "SUCCESS", ip: "LOCAL" },
        { time: "23:01:44", user: "OPERATOR_7", action: "ANOMALY_CLEARED", status: "SUCCESS", ip: "10.0.2.15" },
        { time: "23:15:33", user: "GUEST_USER", action: "AUTH_FAILURE", status: "WARNING", ip: "192.168.1.101" },
        { time: "23:22:11", user: "ADMIN_ALPHA", action: "POLICY_UPDATE", status: "PENDING", ip: "10.0.4.122" },
        { time: "23:45:00", user: "SYS_DAEMON", action: "BACKUP_SEQ", status: "SUCCESS", ip: "LOCAL" },
    ];

    return (
        <AnimatedPage variant="fadeIn">
            <div className="space-y-8">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-12 border-b border-red-900/30 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-red-500">
                            <Database className="w-4 h-4 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Command_Authority_Level_4</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white glitch-text mb-4">
                            Audit <span className="text-red-600">Logs</span>
                        </h1>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                            Real-time transaction and access monitoring. Unauthorized entries flagged.
                        </p>
                    </div>
                </div>

                <CyberCard title="CENTRAL_AUDIT_STREAM" icon={Terminal}>
                    <div className="space-y-4 font-mono text-[10px] md:text-xs">
                        <div className="grid grid-cols-5 gap-4 border-b border-red-900/10 pb-4 text-gray-500 font-bold uppercase tracking-widest">
                            <div>Timestamp</div>
                            <div>Operator</div>
                            <div>Protocol</div>
                            <div>Nexus_ID</div>
                            <div className="text-right">Status</div>
                        </div>
                        <div className="space-y-2">
                            {logs.map((log, i) => (
                                <div key={i} className="grid grid-cols-5 gap-4 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <div className="text-red-500">{log.time}</div>
                                    <div className="text-white font-black">{log.user}</div>
                                    <div className="text-gray-400">{log.action}</div>
                                    <div className="text-gray-600">{log.ip}</div>
                                    <div className={`text-right font-black ${log.status === 'SUCCESS' ? 'text-emerald-500' :
                                        log.status === 'WARNING' ? 'text-orange-500' : 'text-red-500'
                                        }`}>
                                        {log.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CyberCard>
            </div>
        </AnimatedPage>
    );
};

export const AdminSettings = () => {
    const [notifications, setNotifications] = useState({
        auth: true,
        blacklist: true,
        packet: false,
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const { userInfo } = useSelector((state) => state.auth);
    const [changePassword, { isLoading: isPasswordLoading }] = useChangePasswordMutation();
    const [logoutApiCall] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleToggle = (key) => {
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

    return (
        <AnimatedPage variant="fadeIn">
            <div className="space-y-8">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-12 border-b border-red-900/30 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-red-500">
                            <Settings className="w-4 h-4 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Command_Authority_Level_4</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white glitch-text mb-4">
                            System <span className="text-red-600">Config</span>
                        </h1>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                            Global node parameters and security protocol overrides.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CyberCard title="SECURITY_PROTOCOLS" icon={Shield}>
                        <div className="space-y-6">
                            {[
                                { id: 'auth', label: "Multi-Factor Nexus Auth", desc: "Require hardware token for L4 access" },
                                { id: 'blacklist', label: "Global IP Blacklist", desc: "Block known threat actor ranges" },
                                { id: 'packet', label: "Packet Inspection", desc: "Deep packet analysis on all nodes" },
                            ].map((s) => (
                                <div key={s.id} className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{s.label}</div>
                                        <div className="text-[8px] text-gray-500 uppercase font-black">{s.desc}</div>
                                    </div>
                                    <button
                                        onClick={() => handleToggle(s.id)}
                                        className={`w-10 h-5 border ${notifications[s.id] ? 'border-red-500 bg-red-950/20' : 'border-gray-800'} relative cursor-pointer p-1 transition-all`}
                                    >
                                        <motion.div
                                            layout
                                            className={`absolute top-1 bottom-1 w-3 ${notifications[s.id] ? 'right-1 bg-red-500 shadow-[0_0_10px_#ef4444]' : 'left-1 bg-gray-600'}`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </CyberCard>

                    <CyberCard title="SECURITY_MATRIX" icon={Lock}>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="group">
                                <label className="text-[8px] text-red-500/70 uppercase tracking-wider mb-1 block">Current_Cipher</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full bg-transparent border-b border-red-900/30 py-2 text-white text-xs font-mono focus:outline-none focus:border-red-500 transition-colors placeholder-gray-800"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="group">
                                <label className="text-[8px] text-red-500/70 uppercase tracking-wider mb-1 block">New_Cipher_Protocol</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full bg-transparent border-b border-red-900/30 py-2 text-white text-xs font-mono focus:outline-none focus:border-red-500 transition-colors placeholder-gray-800"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="group">
                                <label className="text-[8px] text-red-500/70 uppercase tracking-wider mb-1 block">Verify_Cipher_Protocol</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full bg-transparent border-b border-red-900/30 py-2 text-white text-xs font-mono focus:outline-none focus:border-red-500 transition-colors placeholder-gray-800"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isPasswordLoading}
                                className="w-full bg-red-900/20 border border-red-600 text-red-500 py-3 uppercase tracking-widest text-[10px] font-black hover:bg-red-600 hover:text-white transition-all group relative overflow-hidden flex items-center justify-center gap-2 mt-4"
                            >
                                <Shield className="w-3 h-3" />
                                {isPasswordLoading ? "ENCRYPTING..." : "UPDATE_SECURITY_MATRIX"}
                            </button>
                        </form>
                    </CyberCard>
                </div>
            </div>
        </AnimatedPage>
    );
};
