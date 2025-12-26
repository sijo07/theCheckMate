import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { useSelector } from "react-redux";
import {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
} from "../redux/api/notificationApiSlice";
import socket from "../utils/socket";
import { toast } from "react-toastify";
import {
    Bell,
    Check,
    Trash2,
    AlertTriangle,
    Shield,
    Info,
    CheckCircle,
} from "lucide-react";

const Notifications = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [filter, setFilter] = useState("all");

    const {
        data: notifications = [],
        isLoading,
        refetch,
    } = useGetNotificationsQuery({
        type: filter === "all" || filter === "unread" ? undefined : filter,
        read: filter === "unread" ? false : undefined,
    });

    const [markAsReadApi] = useMarkAsReadMutation();
    const [markAllAsReadApi] = useMarkAllAsReadMutation();
    const [deleteNotificationApi] = useDeleteNotificationMutation();

    // Join room and listen for new notifications
    useEffect(() => {
        if (userInfo?._id) {
            socket.emit("join", userInfo._id);

            const handleNewNotification = (notification) => {
                toast.info(`New Signal: ${notification.title}`, {
                    position: "top-right",
                    autoClose: 5000,
                });
                refetch();
            };

            socket.on("notification", handleNewNotification);

            return () => {
                socket.off("notification", handleNewNotification);
            };
        }
    }, [userInfo, refetch]);

    const getTypeColor = (type) => {
        const colors = {
            critical: "from-red-500 to-pink-600",
            warning: "from-yellow-500 to-orange-600",
            info: "from-blue-500 to-indigo-600",
            success: "from-green-500 to-emerald-600",
        };
        return colors[type] || colors.info;
    };

    const getIcon = (type) => {
        switch (type) {
            case "critical": return AlertTriangle;
            case "warning": return Shield;
            case "success": return CheckCircle;
            default: return Info;
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markAsReadApi(id).unwrap();
        } catch (error) {
            toast.error("Failed to mark notification as read");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsReadApi().unwrap();
            toast.success("All signals cleared");
        } catch (error) {
            toast.error("Failed to clear signals");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotificationApi(id).unwrap();
        } catch (error) {
            toast.error("Failed to delete notification");
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <AnimatedPage variant="fadeIn">
            <div className="min-h-screen bg-[#111112] text-white font-mono">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">
                                    Notifi<span className="text-red-500">cations</span>
                                </h1>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                                    {unreadCount} UNREAD SIGNAL{unreadCount !== 1 ? "S" : ""}
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <motion.button
                                    onClick={handleMarkAllAsRead}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Check className="w-4 h-4" />
                                    Mark all as read
                                </motion.button>
                            )}
                        </div>
                    </motion.div>

                    {/* Filters */}
                    <div className="card-glass rounded-xl p-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: "all", label: "ALL", icon: Bell },
                                { value: "unread", label: "UNREAD", icon: Bell },
                                { value: "critical", label: "CRITICAL", icon: AlertTriangle },
                                { value: "warning", label: "WARNING", icon: Shield },
                                { value: "info", label: "INFO", icon: Info },
                                { value: "success", label: "SUCCESS", icon: CheckCircle },
                            ].map((filterOption) => {
                                const Icon = filterOption.icon;
                                return (
                                    <motion.button
                                        key={filterOption.value}
                                        onClick={() => setFilter(filterOption.value)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${filter === filterOption.value
                                            ? "bg-red-500 text-white shadow-lg"
                                            : "bg-[#111112] border border-white/05 text-gray-500 hover:text-white"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {filterOption.label}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {notifications.length === 0 ? (
                                <motion.div
                                    className="glass-dark rounded-xl p-12 text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-400">No signals found in the stream</p>
                                </motion.div>
                            ) : (
                                notifications.map((notification, index) => {
                                    const Icon = getIcon(notification.type);
                                    return (
                                        <motion.div
                                            key={notification._id}
                                            className={`card-glass rounded-xl p-6 border ${notification.read
                                                ? "border-white/05"
                                                : "border-red-500/30 bg-red-500/05"
                                                }`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            layout
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div
                                                    className={`p-3 rounded-lg bg-gradient-to-br ${getTypeColor(
                                                        notification.type
                                                    )} flex-shrink-0`}
                                                >
                                                    <Icon className="w-5 h-5 text-white" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <h3
                                                            className={`font-semibold ${notification.read
                                                                ? "text-gray-300"
                                                                : "text-white"
                                                                }`}
                                                        >
                                                            {notification.title}
                                                        </h3>
                                                        {!notification.read && (
                                                            <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                                        )}
                                                    </div>
                                                    <p className="text-gray-400 text-sm mb-3">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">
                                                            {new Date(notification.createdAt).toLocaleString()}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {!notification.read && (
                                                                <motion.button
                                                                    onClick={() => handleMarkAsRead(notification._id)}
                                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    title="Mark as read"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </motion.button>
                                                            )}
                                                            <motion.button
                                                                onClick={() =>
                                                                    handleDelete(notification._id)
                                                                }
                                                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Notifications;
