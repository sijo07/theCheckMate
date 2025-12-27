import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    ShieldAlert,
    Cpu,
    Settings,
    LogOut,
    Shield,
    Globe,
    Terminal,
    ChevronLeft,
    ChevronRight,
    Activity,
    Bell,
    Database,
    Zap,
    User
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/authSlice";
import { toast } from "react-toastify";

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();

    const menuItems = [
        { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Incidents", path: "/admin/incidents", icon: ShieldAlert },
        { name: "Services", path: "/admin/services", icon: Cpu },
        { name: "Solutions", path: "/admin/solutions", icon: Activity },
        { name: "Users", path: "/admin/users", icon: User },
        { name: "Audit Logs", path: "/admin/logs", icon: Database },
        { name: "Settings", path: "/admin/settings", icon: Settings },
    ];

    return (
        <motion.div
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="h-screen bg-[#050506] border-r border-red-900/30 flex flex-col relative z-50 overflow-hidden"
        >
            {/* Logo Area */}
            <div className="p-6 border-b border-red-900/20 flex items-center gap-4">
                <div className="w-8 h-8 flex-shrink-0 bg-red-600 flex items-center justify-center rounded-none">
                    <Shield className="w-5 h-5 text-black" />
                </div>
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-black uppercase tracking-tighter text-white"
                    >
                        Check<span className="text-red-500">Mate</span> <span className="text-[10px] text-red-500 opacity-50 block tracking-widest font-mono mt-[-2px]">Admin_CMD</span>
                    </motion.span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-4 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-4 transition-all group relative ${isActive
                                ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                                : "text-gray-500 hover:text-white hover:bg-white/05"
                                }`}
                        >
                            <item.icon size={20} className={isActive ? "text-white" : "group-hover:text-red-500"} />
                            {!isCollapsed && (
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                            )}
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-[-16px] w-[6px] h-full bg-white rounded-none shadow-[0_0_15px_#fff]"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Info */}
            <div className="p-4 border-t border-red-900/20 space-y-4">
                <div className={`flex flex-col gap-2 ${isCollapsed ? 'items-center' : ''}`}>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        <Activity size={12} className="text-red-500" />
                        {!isCollapsed && <span>Load: 34%</span>}
                    </div>
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full py-2 bg-white/05 border border-white/10 text-gray-500 hover:text-white flex items-center justify-center gap-2 rounded transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Collapse_Menu</span></>}
                </button>
            </div>
        </motion.div>
    );
};

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024); // Default collapsed on mobile/tablet
    const { userInfo } = useSelector((state) => state.auth);
    const [time, setTime] = useState(new Date());
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate("/login");
            toast.success("SESSION_TERMINATED");
        } catch (err) {
            toast.error("TERMINATION_FAILED");
        }
    };

    return (
        <div className="flex h-screen bg-[#020203] text-gray-300 font-mono overflow-hidden">
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Dash Header */}
                <header className="h-16 border-b border-red-900/20 bg-black/50 backdrop-blur-md px-8 flex items-center justify-between relative z-40">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-950/30 border border-red-900/30 rounded text-red-500 text-[10px] font-black">
                            <Zap size={10} className="animate-pulse" />
                            SYS_PROTECT: ACTIVE
                        </div>
                        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] hidden md:block">
                            Local_Node: <span className="text-white">Nexus_Zero</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{userInfo?.username}</span>
                            <span className="text-[8px] text-red-500 uppercase tracking-widest font-bold">Admin_Level_4</span>
                        </div>

                        <div className="h-8 w-[1px] bg-red-900/30" />

                        <div className="text-red-500 text-[10px] font-black tracking-widest">
                            {time.toLocaleTimeString()}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                            title="Terminate Session"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Main View Area */}
                <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                    {/* Background Ambience */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px]" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px]" />
                    </div>

                    <div className="relative z-10 p-4 md:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
