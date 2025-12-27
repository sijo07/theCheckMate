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
import { useGetAllIncidentsQuery } from "../redux/api/incidentApiSlice";
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
    Radio,
    Zap,
    Globe,
    Activity,
    Wifi
} from "lucide-react";

// --- Components ---

const ScanningLine = () => (
    <motion.div
        className="absolute top-0 left-0 w-full h-px bg-red-500/50 shadow-[0_0_10px_#ef4444]"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    />
);

const SignalCard = ({ notification, onRead, onDelete, index }) => {
    const isCritical = notification.type === 'critical';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className={`relative group mb-4 border ${notification.read ? 'border-white/5 bg-[#0a0a0b]' : 'border-red-500/30 bg-red-900/5'} overflow-hidden transition-all hover:border-red-500/50`}
        >
            {!notification.read && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl animate-pulse shadow-[0_0_10px_#ef4444]" />}

            <div className="p-5 flex gap-5">
                {/* Icon Column */}
                <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 border ${isCritical ? 'border-red-500 text-red-500' : 'border-gray-700 text-gray-500'} flex items-center justify-center bg-black/50`}>
                        {isCritical ? <AlertTriangle size={18} /> : <Bell size={18} />}
                    </div>
                    <div className="h-full w-px bg-white/5 my-2" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className={`text-sm font-black uppercase tracking-wider ${notification.read ? 'text-gray-500' : 'text-white'}`}>
                            {notification.title}
                        </h4>
                        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest whitespace-nowrap">
                            {new Date(notification.createdAt).toLocaleTimeString()}
                        </span>
                    </div>

                    <p className="text-xs font-mono text-gray-400 leading-relaxed mb-4">
                        {notification.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                            <button
                                onClick={() => onRead(notification._id)}
                                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-[9px] font-bold uppercase tracking-widest text-white border border-white/10 flex items-center gap-2 transition-colors"
                            >
                                <Check size={10} /> Ack
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(notification._id)}
                            className="px-3 py-1 bg-red-900/10 hover:bg-red-900/30 text-[9px] font-bold uppercase tracking-widest text-red-500 border border-red-900/30 flex items-center gap-2 transition-colors"
                        >
                            <Trash2 size={10} /> Purge
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ThreatWireItem = ({ incident }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-3 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 transition-colors cursor-default group"
    >
        <div className="mt-1">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        </div>
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest truncate max-w-[150px]">
                    {incident?.title || "UNKNOWN_THREAT"}
                </span>
                <span className="text-[8px] font-mono text-gray-600 bg-black px-1 border border-white/10">
                    {incident?.severity ? incident.severity.slice(0, 3) : "UNK"}
                </span>
            </div>
            <div className="text-[9px] text-gray-400 font-mono uppercase truncate max-w-[200px]">
                Vector: {incident?.attackVector || "Unknown"}
            </div>
        </div>
    </motion.div>
);

const Notifications = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [filter, setFilter] = useState("all");

    // Notifications API
    const {
        data: notifications = [],
        isLoading: notifLoading,
        refetch,
    } = useGetNotificationsQuery({
        type: filter === "all" || filter === "unread" ? undefined : filter,
        read: filter === "unread" ? false : undefined,
    });

    const [markAsReadApi] = useMarkAsReadMutation();
    const [markAllAsReadApi] = useMarkAllAsReadMutation();
    const [deleteNotificationApi] = useDeleteNotificationMutation();

    // Threat Feed API (Polling for "Live" feel)
    const { data: incidents = [] } = useGetAllIncidentsQuery(undefined, { pollingInterval: 15000 });

    // Join room setup
    useEffect(() => {
        if (userInfo?._id) {
            socket.emit("join", userInfo._id);
            const handleNewNotification = (notification) => {
                toast.info(`INCOMING SIGNAL: ${notification.title}`);
                refetch();
            };
            socket.on("notification", handleNewNotification);
            return () => socket.off("notification", handleNewNotification);
        }
    }, [userInfo, refetch]);

    // Handlers
    const handleMarkAsRead = async (id) => { try { await markAsReadApi(id).unwrap(); } catch (e) { toast.error("Ack Failed"); } };
    const handleMarkAllAsRead = async () => { try { await markAllAsReadApi().unwrap(); toast.success("All Signals Acknowledged"); } catch (e) { toast.error("Command Failed"); } };
    const handleDelete = async (id) => { try { await deleteNotificationApi(id).unwrap(); } catch (e) { toast.error("Purge Failed"); } };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <AnimatedPage variant="fadeIn">
            <div className="min-h-screen bg-[#030304] text-white font-mono relative overflow-hidden pb-12">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                />

                <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

                    {/* MAIN FEED (8 Cols) */}
                    <div className="lg:col-span-8 flex flex-col h-full">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2 text-red-500">
                                    <Radio className="w-4 h-4 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Encrypted_Signal_Stream</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white glitch-text">
                                    Signal <span className="text-red-600">Intel</span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <div className="text-right">
                                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Unread_Signals</div>
                                    <div className="text-xl font-black text-white">{unreadCount}</div>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="p-3 bg-red-900/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                        title="Ack All"
                                    >
                                        <Check size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {[
                                { id: 'all', label: 'All_Traffic' },
                                { id: 'unread', label: 'Unread_Only' },
                                { id: 'critical', label: 'Crit_Alerts' },
                                { id: 'warning', label: 'Warnings' }
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all ${filter === f.id ? 'bg-red-600 border-red-600 text-black' : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30'}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {/* Feed List */}
                        <div className="flex-1 overflow-y-auto">
                            <AnimatePresence>
                                {notifications.length > 0 ? (
                                    notifications.map((notif, i) => (
                                        <SignalCard
                                            key={notif._id}
                                            notification={notif}
                                            onRead={handleMarkAsRead}
                                            onDelete={handleDelete}
                                            index={i}
                                        />
                                    ))
                                ) : (
                                    <div className="py-20 text-center border border-dashed border-white/10 opacity-50">
                                        <Wifi className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                                        <div className="text-xs uppercase tracking-widest text-gray-500">No_Signals_Intercepted</div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* THREAT WIRE (4 Cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* Live Feed Panel */}
                        <div className="bg-[#050506] border border-red-900/30 flex-1 flex flex-col relative overflow-hidden h-[600px] lg:h-auto group">
                            <ScanningLine />

                            <div className="p-4 border-b border-red-900/20 bg-red-900/5 flex justify-between items-center z-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
                                    <Activity size={12} className="animate-spin-slow" /> Threat_Wire
                                </span>
                                <span className="flex gap-1">
                                    <span className="w-1 h-3 bg-red-500/50" />
                                    <span className="w-1 h-3 bg-red-500/30" />
                                    <span className="w-1 h-3 bg-red-500/10" />
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide relative z-10">
                                <div className="space-y-1">
                                    {incidents.slice(0, 20).map((inc, i) => (
                                        <ThreatWireItem key={i} incident={inc} />
                                    ))}
                                </div>
                            </div>

                            <div className="p-3 border-t border-red-900/20 bg-black/50 text-[9px] text-gray-500 font-mono text-center uppercase">
                                Stream Connected // Latency: 12ms
                            </div>
                        </div>

                        {/* Stats Panel */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 border-t-2 border-white/10">
                                <div className="text-[8px] uppercase tracking-widest text-gray-500 mb-1">Total_Intercepts</div>
                                <div className="text-xl font-black text-white">{incidents.length}</div>
                            </div>
                            <div className="bg-red-900/10 p-4 border-t-2 border-red-600">
                                <div className="text-[8px] uppercase tracking-widest text-red-400 mb-1">Crit_Threats</div>
                                <div className="text-xl font-black text-white">
                                    {incidents.filter(i => i.severity === 'critical').length}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Notifications;
