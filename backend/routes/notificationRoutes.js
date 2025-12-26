import express from "express";
import {
    getNotifications,
    getNotificationById,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
} from "../controllers/notificationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes (none for notifications)

// Protected routes
router.route("/").get(authenticate, getNotifications).post(authenticate, createNotification);
router.route("/unread-count").get(authenticate, getUnreadCount);
router.route("/read-all").put(authenticate, markAllAsRead);
router.route("/:id").get(authenticate, getNotificationById).delete(authenticate, deleteNotification);
router.route("/:id/read").put(authenticate, markAsRead);

export default router;
