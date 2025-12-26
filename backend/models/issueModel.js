import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: [
                "bug",
                "security_vulnerability",
                "performance_issue",
                "feature_request",
                "configuration_error",
                "other",
            ],
            default: "other",
        },
        priority: {
            type: String,
            enum: ["critical", "high", "medium", "low"],
            default: "medium",
        },
        status: {
            type: String,
            enum: ["open", "in_progress", "resolved", "closed", "reopened"],
            default: "open",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        relatedIncident: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Incident",
        },
        relatedSolution: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Solution",
        },
        resolution: {
            description: String,
            resolvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            resolvedAt: Date,
        },
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                text: String,
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        tags: [String],
        attachments: [
            {
                filename: String,
                url: String,
                uploadedAt: Date,
            },
        ],
        dueDate: Date,
        estimatedHours: Number,
        actualHours: Number,
    },
    { timestamps: true }
);

// Indexes
issueSchema.index({ status: 1, priority: 1 });
issueSchema.index({ assignedTo: 1 });
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ createdAt: -1 });

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
