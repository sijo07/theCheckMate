import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/api/userApiSlice";
import { useGetUnreadCountQuery } from "../redux/api/notificationApiSlice";
import { logout } from "../redux/features/authSlice";
import socket from "../utils/socket";
import {

    Bell,
    User,
    Settings,
    LogOut,
    Shield,
    BarChart3,
    FileText,
    Globe,
    Phone,
    AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [logoutApiCall] = useLogoutMutation();
    const { data: unreadData, refetch: refetchUnread } = useGetUnreadCountQuery(undefined, {
        skip: !userInfo,
    });

    const notificationCount = unreadData?.count || 0;

    // Handle real-time notification updates
    useEffect(() => {
        if (userInfo?._id && socket) {
            try {
                socket.emit("join", userInfo._id);
                const handleNotification = () => {
                    refetchUnread();
                };
                socket.on("notification", handleNotification);

                return () => {
                    socket.off("notification", handleNotification);
                };
            } catch (error) {
                console.error("Socket Connection Failed:", error);
            }
        }
    }, [userInfo, refetchUnread]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            toast.error(error?.data?.message || "Logout failed");
        }
    };

    const navLinks = [
        { name: "Home", path: "/", icon: Shield },
        { name: "Threat Intel", path: "/threat-intelligence", icon: AlertTriangle },
        { name: "Analytics", path: "/admin/dashboard", icon: BarChart3, adminOnly: true },
        { name: "Services", path: "/services", icon: Shield },
        { name: "Solutions", path: "/solutions", icon: FileText },
        { name: "Issues", path: "/issues", icon: AlertTriangle },
        { name: "Reports", path: "/reports", icon: FileText },
        { name: "Contact", path: "/contact", icon: Phone },
    ];

    const isHome = location.pathname === "/";

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome
                    ? "glass-dark shadow-lg"
                    : "bg-transparent"
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Left: Logo (Takes equal space to balance Right) */}
                        <div className="flex-1 flex items-center justify-start">
                            <Link to="/" className="flex items-center space-x-2 group">
                                <motion.div
                                    className="p-2 rounded-lg bg-red-500/10 border border-red-500/50"
                                    whileHover={{ rotate: 360, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Shield className="w-6 h-6 text-red-500" />
                                </motion.div>
                                <span className="text-lg md:text-xl font-bold tracking-tighter text-white uppercase">
                                    Check<span className="text-red-500">Mate</span>
                                </span>
                            </Link>
                        </div>

                        {/* Center: Desktop Navigation (Centered on screen) */}

                        <div className="hidden lg:flex items-center justify-center px-6">
                            <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
                                {navLinks.map((link) => {
                                    if (link.adminOnly && !userInfo?.isAdmin) return null;
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={handleNavClick}
                                            className={`relative px-1 py-2 transition-colors group whitespace-nowrap ${location.pathname === link.path ? "text-white" : "text-gray-400 hover:text-white"
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Icon className={`w-3.5 h-3.5 transition-colors ${location.pathname === link.path ? "text-red-500" : "group-hover:text-red-500"
                                                    }`} />
                                                <span>{link.name}</span>
                                            </div>
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                                                initial={false}
                                                animate={{ scaleX: location.pathname === link.path ? 1 : 0 }}
                                                whileHover={{ scaleX: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Tools (Takes equal space to balance Left) */}
                        {/* Right: Tools (Takes equal space to balance Left) */}
                        <div className="flex-1 flex items-center justify-end space-x-2 md:space-x-4">
                            {/* Notification Bell */}
                            {userInfo && (
                                <motion.button
                                    className="relative p-2 text-gray-300 hover:text-white transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/notifications")}
                                >
                                    <Bell className="w-5 h-5" />
                                    {notificationCount > 0 && (
                                        <motion.span
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500 }}
                                        >
                                            {notificationCount}
                                        </motion.span>
                                    )}
                                </motion.button>
                            )}

                            {/* User Menu */}
                            {userInfo ? (
                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsUserMenuOpen(true)}
                                    onMouseLeave={() => setIsUserMenuOpen(false)}
                                >
                                    <motion.button
                                        className="flex items-center space-x-3 p-1 pr-3 rounded-lg hover:bg-white/05 transition-colors group relative"
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    >
                                        {/* Tactical Avatar Container */}
                                        <div className="relative w-10 h-10 flex items-center justify-center">
                                            {/* Rotating Ring */}
                                            <motion.div
                                                className="absolute inset-0 border-2 border-dashed border-red-700/30 rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            />

                                            {/* Profile Image or Initials */}
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-red-600/50 relative z-10 bg-black">
                                                <img
                                                    src={userInfo.profilePic || `https://ui-avatars.com/api/?name=${userInfo.username}&background=000&color=fff`}
                                                    alt={userInfo.username}
                                                    className="w-full h-full object-cover group-hover:opacity-100 transition-opacity"
                                                />
                                            </div>

                                            {/* Corner Brackets */}
                                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-600" />
                                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-600" />
                                        </div>

                                        <span className="hidden lg:block text-white text-xs font-bold uppercase tracking-wider font-mono group-hover:text-red-400 transition-colors">
                                            {userInfo.username}
                                        </span>
                                    </motion.button>

                                    {/* User Dropdown */}
                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                className="absolute right-0 top-full mt-2 w-56 bg-black/95 backdrop-blur-xl border border-red-500/30 rounded-none shadow-[0_0_30px_rgba(220,38,38,0.15)] overflow-hidden z-50"
                                                initial={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                                                animate={{ opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                                                exit={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {/* Background Raster */}
                                                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                                                {/* Scanning Line */}
                                                <motion.div
                                                    className="absolute left-0 right-0 h-1 bg-red-600/30 z-0 pointer-events-none shadow-[0_0_10px_#ef4444]"
                                                    animate={{ top: ["0%", "100%"] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                />

                                                <div className="relative z-10 py-2">
                                                    <Link
                                                        to="/profile"
                                                        className="flex items-center space-x-3 px-6 py-3 text-gray-200 hover:text-white hover:bg-red-900/10 transition-colors group border-l-2 border-transparent hover:border-red-600"
                                                        onClick={handleNavClick}
                                                    >
                                                        <User className="w-4 h-4 text-red-500 group-hover:text-red-400 transition-colors" />
                                                        <span className="text-[10px] uppercase tracking-widest font-mono">Profile_Config</span>
                                                    </Link>
                                                    <Link
                                                        to="/settings"
                                                        className="flex items-center space-x-3 px-6 py-3 text-gray-200 hover:text-white hover:bg-red-900/10 transition-colors group border-l-2 border-transparent hover:border-red-600"
                                                        onClick={handleNavClick}
                                                    >
                                                        <Settings className="w-4 h-4 text-red-500 group-hover:text-red-400 transition-colors" />
                                                        <span className="text-[10px] uppercase tracking-widest font-mono">Sys_Settings</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setIsUserMenuOpen(false);
                                                            handleLogout();
                                                        }}
                                                        className="w-full flex items-center space-x-3 px-6 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-colors group border-l-2 border-transparent hover:border-red-600"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span className="text-[10px] uppercase tracking-widest font-mono">Term_Logout</span>
                                                    </button>
                                                </div>

                                                {/* Footer Metadata */}
                                                <div className="px-4 py-2 bg-black/50 border-t border-white/05">
                                                    <div className="flex justify-between items-center text-[8px] font-mono text-gray-400 uppercase tracking-wider">
                                                        <span>STATUS: AUTH</span>
                                                        <span className="text-red-900">SEC_LVL_4</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center space-x-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-bold text-xs uppercase tracking-widest"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <motion.button
                                className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center space-y-1.5 focus:outline-none"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                animate={isMobileMenuOpen ? "open" : "closed"}
                            >
                                <motion.span
                                    className="w-6 h-0.5 bg-white rounded-full block"
                                    variants={{
                                        closed: { rotate: 0, y: 0 },
                                        open: { rotate: 45, y: 7 },
                                    }}
                                />
                                <motion.span
                                    className="w-6 h-0.5 bg-white rounded-full block"
                                    variants={{
                                        closed: { opacity: 1 },
                                        open: { opacity: 0 },
                                    }}
                                />
                                <motion.span
                                    className="w-6 h-0.5 bg-white rounded-full block"
                                    variants={{
                                        closed: { rotate: 0, y: 0 },
                                        open: { rotate: -45, y: -7 },
                                    }}
                                />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="md:hidden glass-dark border-t border-white/10"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="px-4 py-4 space-y-2">
                                {navLinks.map((link) => {
                                    if (link.adminOnly && !userInfo?.isAdmin) return null;
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === link.path
                                                ? "bg-red-500/10 text-white border border-red-500/20"
                                                : "text-gray-300 hover:bg-white/10"
                                                }`}
                                            onClick={handleNavClick}
                                        >
                                            <Icon className={`w-5 h-5 ${location.pathname === link.path ? "text-red-500" : ""}`} />
                                            <span className="font-medium">{link.name}</span>
                                        </Link>
                                    );
                                })}

                                {/* Mobile Auth Buttons */}
                                {!userInfo && (
                                    <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                                        <Link
                                            to="/login"
                                            className="block w-full text-center px-4 py-3 text-gray-300 hover:text-white border border-white/10 rounded-lg"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block w-full text-center px-4 py-3 bg-red-600 text-white font-bold rounded-lg uppercase tracking-widest text-xs"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}

                                {/* Mobile User Actions */}
                                {userInfo && (
                                    <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                                        <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                                            <div className="w-8 h-8 rounded-full border border-red-500/50 overflow-hidden">
                                                <img
                                                    src={userInfo.profilePic || `https://ui-avatars.com/api/?name=${userInfo.username}&background=000&color=fff`}
                                                    alt={userInfo.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white text-xs font-bold font-mono uppercase truncate max-w-[150px]">{userInfo.username}</span>
                                                <span className="text-[8px] text-red-500 font-mono uppercase tracking-widest">Operator_Active</span>
                                            </div>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10"
                                            onClick={handleNavClick}
                                        >
                                            <User className="w-5 h-5 text-red-500" />
                                            <span className="font-medium">Profile_Config</span>
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10"
                                            onClick={handleNavClick}
                                        >
                                            <Settings className="w-5 h-5 text-red-500" />
                                            <span className="font-medium">Sys_Settings</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/10"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span className="font-medium text-left">Term_Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Spacer to prevent content from going under fixed navbar, except on home page where we want immersive hero */}
            {!isHome && <div className="h-20" />}
        </>
    );
};

export default Navbar;
