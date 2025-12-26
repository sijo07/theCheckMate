import { motion } from "framer-motion";
import PropTypes from "prop-types";

/**
 * LoadingSkeleton - Animated loading placeholder components
 * Provides skeleton screens for better perceived performance
 */

// Card Skeleton
export const CardSkeleton = ({ count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                    <div className="skeleton h-6 w-3/4 rounded mb-4"></div>
                    <div className="skeleton h-4 w-full rounded mb-2"></div>
                    <div className="skeleton h-4 w-5/6 rounded mb-2"></div>
                    <div className="skeleton h-4 w-4/6 rounded"></div>
                </div>
            ))}
        </>
    );
};

CardSkeleton.propTypes = {
    count: PropTypes.number,
};

// Stat Card Skeleton
export const StatCardSkeleton = ({ count = 4 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="skeleton h-4 w-24 rounded mb-2"></div>
                            <div className="skeleton h-8 w-16 rounded"></div>
                        </div>
                        <div className="skeleton h-12 w-12 rounded-lg"></div>
                    </div>
                </div>
            ))}
        </>
    );
};

StatCardSkeleton.propTypes = {
    count: PropTypes.number,
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="skeleton h-6 w-48 rounded mb-6"></div>
            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex gap-4">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <div key={colIndex} className="skeleton h-10 flex-1 rounded"></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

TableSkeleton.propTypes = {
    rows: PropTypes.number,
    columns: PropTypes.number,
};

// Chart Skeleton
export const ChartSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="skeleton h-6 w-48 rounded mb-6"></div>
            <div className="h-64 flex items-end gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="skeleton flex-1 rounded-t"
                        style={{
                            height: `${Math.random() * 80 + 20}%`,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

// List Skeleton
export const ListSkeleton = ({ items = 5 }) => {
    return (
        <div className="space-y-3">
            {Array.from({ length: items }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
                >
                    <div className="flex items-center gap-4">
                        <div className="skeleton h-12 w-12 rounded-full"></div>
                        <div className="flex-1">
                            <div className="skeleton h-4 w-3/4 rounded mb-2"></div>
                            <div className="skeleton h-3 w-1/2 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

ListSkeleton.propTypes = {
    items: PropTypes.number,
};

// Page Skeleton (Full page loading)
export const PageSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="skeleton h-10 w-64 rounded mb-8"></div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCardSkeleton count={4} />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <ChartSkeleton />
                    <ChartSkeleton />
                </div>

                {/* Table */}
                <TableSkeleton />
            </div>
        </div>
    );
};

// Pulsing Loader (for inline loading states)
export const PulsingLoader = ({ size = "md", className = "" }) => {
    const sizes = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
    };

    return (
        <motion.div
            className={`${sizes[size]} rounded-full bg-blue-500 ${className}`}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
};

PulsingLoader.propTypes = {
    size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
    className: PropTypes.string,
};

// Spinner Loader
export const SpinnerLoader = ({ size = "md", className = "" }) => {
    const sizes = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4",
        xl: "h-16 w-16 border-4",
    };

    return (
        <div
            className={`${sizes[size]} border-blue-500 border-t-transparent rounded-full animate-spin ${className}`}
        />
    );
};

SpinnerLoader.propTypes = {
    size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
    className: PropTypes.string,
};

export default {
    CardSkeleton,
    StatCardSkeleton,
    TableSkeleton,
    ChartSkeleton,
    ListSkeleton,
    PageSkeleton,
    PulsingLoader,
    SpinnerLoader,
};
