import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import AnimatedPage from "../components/AnimatedPage";
import Navbar from "../components/Navbar";
import {
    User,
    Bell,
    Shield,
    Palette,
    Key,
    Save,
    Moon,
    Sun,
    Monitor,
} from "lucide-react";
import { toast } from "react-toastify";

const Settings = () => {
    const { userInfo } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState("profile");
    const [theme, setTheme] = useState("dark");
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        critical: true,
        warning: true,
        info: false,
    });

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "appearance", label: "Appearance", icon: Palette },
    ];

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    const handleNotificationToggle = (key) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
    };

    return (
        <AnimatedPage variant="fadeIn">
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-2 text-gradient-cyber">
                            Settings
                        </h1>
                        <p className="text-gray-400">
                            Manage your account preferences and security
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar Tabs */}
                        <div className="lg:col-span-1">
                            <div className="glass-dark rounded-xl p-4 space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <motion.button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                                                    ? "bg-blue-500 text-white shadow-lg"
                                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                }`}
                                            whileHover={{ x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{tab.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-3">
                            <motion.div
                                key={activeTab}
                                className="glass-dark rounded-xl p-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Profile Tab */}
                                {activeTab === "profile" && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

                                        <div className="flex items-center gap-6 mb-8">
                                            <img
                                                src={userInfo?.profilePic || `https://ui-avatars.com/api/?name=${userInfo?.username}`}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full border-4 border-blue-500"
                                            />
                                            <div>
                                                <h3 className="text-xl font-semibold">{userInfo?.username}</h3>
                                                <p className="text-gray-400">{userInfo?.email}</p>
                                                <button className="mt-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-all text-sm">
                                                    Change Photo
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    defaultValue={userInfo?.username}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    defaultValue={userInfo?.email}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    defaultValue={userInfo?.phone}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Notifications Tab */}
                                {activeTab === "notifications" && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4">Channels</h3>
                                                <div className="space-y-3">
                                                    {[
                                                        { key: "email", label: "Email Notifications" },
                                                        { key: "push", label: "Push Notifications" },
                                                        { key: "sms", label: "SMS Notifications" },
                                                    ].map((item) => (
                                                        <div
                                                            key={item.key}
                                                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                                                        >
                                                            <span className="text-white">{item.label}</span>
                                                            <button
                                                                onClick={() => handleNotificationToggle(item.key)}
                                                                className={`relative w-12 h-6 rounded-full transition-colors ${notifications[item.key]
                                                                        ? "bg-blue-500"
                                                                        : "bg-gray-600"
                                                                    }`}
                                                            >
                                                                <motion.div
                                                                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                                                                    animate={{
                                                                        x: notifications[item.key] ? 24 : 0,
                                                                    }}
                                                                    transition={{ type: "spring", stiffness: 500 }}
                                                                />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold mb-4">Alert Types</h3>
                                                <div className="space-y-3">
                                                    {[
                                                        { key: "critical", label: "Critical Threats" },
                                                        { key: "warning", label: "Warnings" },
                                                        { key: "info", label: "Informational" },
                                                    ].map((item) => (
                                                        <div
                                                            key={item.key}
                                                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                                                        >
                                                            <span className="text-white">{item.label}</span>
                                                            <button
                                                                onClick={() => handleNotificationToggle(item.key)}
                                                                className={`relative w-12 h-6 rounded-full transition-colors ${notifications[item.key]
                                                                        ? "bg-blue-500"
                                                                        : "bg-gray-600"
                                                                    }`}
                                                            >
                                                                <motion.div
                                                                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                                                                    animate={{
                                                                        x: notifications[item.key] ? 24 : 0,
                                                                    }}
                                                                    transition={{ type: "spring", stiffness: 500 }}
                                                                />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Security Tab */}
                                {activeTab === "security" && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div className="pt-4 border-t border-white/10">
                                                <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                                    <div>
                                                        <p className="text-white font-medium">Enable 2FA</p>
                                                        <p className="text-sm text-gray-400">Add an extra layer of security</p>
                                                    </div>
                                                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors">
                                                        Enable
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Appearance Tab */}
                                {activeTab === "appearance" && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold mb-6">Appearance Settings</h2>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Theme</h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                {[
                                                    { value: "light", label: "Light", icon: Sun },
                                                    { value: "dark", label: "Dark", icon: Moon },
                                                    { value: "auto", label: "Auto", icon: Monitor },
                                                ].map((themeOption) => {
                                                    const Icon = themeOption.icon;
                                                    return (
                                                        <motion.button
                                                            key={themeOption.value}
                                                            onClick={() => setTheme(themeOption.value)}
                                                            className={`p-6 rounded-xl border-2 transition-all ${theme === themeOption.value
                                                                    ? "border-blue-500 bg-blue-500/10"
                                                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                                                }`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Icon className="w-8 h-8 mx-auto mb-2" />
                                                            <p className="text-sm font-medium">{themeOption.label}</p>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Save Button */}
                                <div className="flex justify-end mt-8 pt-6 border-t border-white/10">
                                    <motion.button
                                        onClick={handleSave}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Settings;
