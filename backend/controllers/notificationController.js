import asyncHandler from "../middlewares/asyncHandler.js";
import Notification from "../models/notificationModel.js";

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
    const { type, read } = req.query;

    const filter = { user: req.user._id };

    if (type && type !== "all") {
        filter.type = type;
    }

    if (read !== undefined) {
        filter.read = read === "true";
    }

    const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .limit(100)
        .populate("relatedIncident", "title type");

    res.json(notifications);
});

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
const getNotificationById = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id).populate(
        "relatedIncident"
    );

    if (!notification) {
        res.status(404).json({ message: "QUERY_FAILED: NOTIFICATION_NOT_FOUND" });
        return;
    }

    // Check if notification belongs to user
    if (notification.user.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: "ACCESS_DENIED: UNAUTHORIZED_NOTIFICATION_ACCESS" });
        return;
    }

    res.json(notification);
});

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
    const { userId, type, title, message, relatedIncident, metadata } = req.body;

    const notification = await Notification.create({
        user: userId || req.user._id,
        type,
        title,
        message,
        relatedIncident,
        metadata,
    });

    // Emit socket event for real-time notification
    if (req.app.get("io")) {
        req.app.get("io").to(userId || req.user._id.toString()).emit("notification", notification);
    }

    res.status(201).json(notification);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404).json({ message: "OVERRIDE_FAILED: NOTIFICATION_NOT_FOUND" });
        return;
    }

    // Check if notification belongs to user
    if (notification.user.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: "ACCESS_DENIED: UNAUTHORIZED_PROTOCOL_OVERRIDE" });
        return;
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, read: false },
        { read: true }
    );

    res.json({ message: "ALL_NOTIFICATIONS_MARKED_AS_READ" });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404).json({ message: "PURGE_FAILED: NOTIFICATION_NOT_FOUND" });
        return;
    }

    // Check if notification belongs to user
    if (notification.user.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: "ACCESS_DENIED: UNAUTHORIZED_PURGE_REQUEST" });
        return;
    }

    await notification.deleteOne();

    res.json({ message: "NOTIFICATION_PURGED_SUCCESSFULLY" });
});

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({
        user: req.user._id,
        read: false,
    });

    res.json({ count });
});

export {
    getNotifications,
    getNotificationById,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
};
