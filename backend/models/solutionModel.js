import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema(
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
        category: {
            type: String,
            enum: [
                "malware_removal",
                "vulnerability_patch",
                "security_config",
                "incident_response",
                "threat_mitigation",
                "compliance_fix",
                "other",
            ],
            default: "other",
        },
        severity: {
            type: String,
            enum: ["critical", "high", "medium", "low"],
            default: "medium",
        },
        relatedIncident: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Incident",
        },
        steps: [
            {
                order: Number,
                title: String,
                description: String,
                completed: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
        },
        effectiveness: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        appliedCount: {
            type: Number,
            default: 0,
        },
        tags: [String],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        attachments: [
            {
                filename: String,
                url: String,
                uploadedAt: Date,
            },
        ],
    },
    { timestamps: true }
);

// Indexes for performance
solutionSchema.index({ category: 1, status: 1 });
solutionSchema.index({ severity: 1 });
solutionSchema.index({ tags: 1 });
solutionSchema.index({ createdAt: -1 });

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;
