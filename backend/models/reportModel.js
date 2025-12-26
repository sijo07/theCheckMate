import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: [
                "incident_summary",
                "threat_analysis",
                "compliance",
                "custom",
                "scheduled",
            ],
            default: "custom",
        },
        dateRange: {
            start: {
                type: Date,
                required: true,
            },
            end: {
                type: Date,
                required: true,
            },
        },
        filters: {
            incidentTypes: [String],
            countries: [String],
            industries: [String],
            severityLevels: [String],
        },
        format: {
            type: String,
            enum: ["pdf", "csv", "json"],
            default: "pdf",
        },
        status: {
            type: String,
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending",
        },
        fileUrl: {
            type: String,
        },
        schedule: {
            enabled: {
                type: Boolean,
                default: false,
            },
            frequency: {
                type: String,
                enum: ["daily", "weekly", "monthly"],
            },
            nextRun: {
                type: Date,
            },
        },
        metadata: {
            incidentCount: Number,
            generatedAt: Date,
            fileSize: Number,
        },
    },
    { timestamps: true }
);

// Index for faster queries
reportSchema.index({ user: 1, createdAt: -1 });
reportSchema.index({ status: 1 });

const Report = mongoose.model("Report", reportSchema);

export default Report;
