import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/api/userApiSlice";
import { useGetUnreadCountQuery } from "../redux/api/notificationApiSlice";
import { logout } from "../redux/features/authSlice";
import socket from "../utils/socket";
import {
    Menu,
    X,
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
        if (userInfo?._id) {
            socket.emit("join", userInfo._id);
            socket.on("notification", () => {
                refetchUnread();
            });

            return () => {
                socket.off("notification");
            };
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
                    <div className="flex items-center h-16">
                        {/* Logo - Left */}
                        <div className="flex-1 flex justify-start">
                            <Link to="/" className="flex items-center space-x-2 group">
                                <motion.div
                                    className="p-2 rounded-lg bg-red-500/10 border border-red-500/50"
                                    whileHover={{ rotate: 360, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Shield className="w-6 h-6 text-red-500" />
                                </motion.div>
                                <span className="text-xl font-bold tracking-tighter text-white uppercase">
                                    Check<span className="text-red-500">Mate</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation - Center */}
                        <div className="hidden md:flex items-center justify-center px-12">
                            <div className="flex items-center space-x-6 text-[11px] font-bold uppercase tracking-widest">
                                {navLinks.map((link) => {
                                    if (link.adminOnly && !userInfo?.isAdmin) return null;
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
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

                        {/* Right Section - Right Tools */}
                        <div className="flex-1 flex items-center justify-end space-x-6">
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
                                <div className="relative">
                                    <motion.button
                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    >
                                        <img
                                            src={userInfo.profilePic || `https://ui-avatars.com/api/?name=${userInfo.username}`}
                                            alt={userInfo.username}
                                            className="w-8 h-8 rounded-full border-2 border-red-500 object-cover"
                                        />
                                        <span className="hidden lg:block text-white text-sm font-medium">
                                            {userInfo.username}
                                        </span>
                                    </motion.button>

                                    {/* User Dropdown */}
                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                className="absolute right-0 mt-2 w-48 glass-dark rounded-lg shadow-xl overflow-hidden"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:bg-white/10 transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span>Profile</span>
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:bg-white/10 transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    <span>Settings</span>
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full flex items-center space-x-2 px-4 py-3 text-red-400 hover:bg-white/10 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Logout</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
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
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <Icon className={`w-5 h-5 ${location.pathname === link.path ? "text-red-500" : ""}`} />
                                            <span className="font-medium">{link.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Spacer to prevent content from going under fixed navbar */}
            <div className="h-16" />
        </>
    );
};

export default Navbar;
