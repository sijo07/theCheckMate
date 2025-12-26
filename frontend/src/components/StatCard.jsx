import { motion } from "framer-motion";
import PropTypes from "prop-types";

/**
 * StatCard - Enhanced statistics card with animations
 * Displays key metrics with gradient backgrounds and animated counters
 */
const StatCard = ({
    title,
    value,
    icon,
    gradient = "from-blue-500 to-indigo-600",
    trend,
    trendValue,
    loading = false,
    onClick,
}) => {
    return (
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer overflow-hidden relative"
            whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300 },
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Background Gradient Overlay */}
            <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-16 -mt-16`}
            />

            <div className="relative flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {title}
                    </p>

                    {loading ? (
                        <div className="skeleton h-8 w-24 rounded"></div>
                    ) : (
                        <motion.p
                            className="text-2xl sm:text-3xl font-black text-white"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            {value}
                        </motion.p>
                    )}

                    {/* Trend Indicator */}
                    {trend && trendValue && (
                        <motion.div
                            className={`flex items-center gap-1 mt-2 text-sm ${trend === "up" ? "text-green-500" : "text-red-500"
                                }`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {trend === "up" ? (
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            )}
                            <span className="font-medium">{trendValue}</span>
                        </motion.div>
                    )}
                </div>

                {/* Icon */}
                <motion.div
                    className={`p-3 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                >
                    {icon}
                </motion.div>
            </div>

            {/* Animated Border */}
            <motion.div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient}`}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.4, duration: 0.6 }}
            />
        </motion.div>
    );
};

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.node.isRequired,
    gradient: PropTypes.string,
    trend: PropTypes.oneOf(["up", "down"]),
    trendValue: PropTypes.string,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
};

export default StatCard;
