import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["critical", "warning", "info", "success"],
            default: "info",
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        relatedIncident: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Incident",
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

// Index for faster queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

// Auto-delete notifications older than 30 days
notificationSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
