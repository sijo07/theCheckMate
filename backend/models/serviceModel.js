import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        name: {
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
                "threat_analysis",
                "vulnerability_assessment",
                "penetration_testing",
                "security_audit",
                "incident_response",
                "compliance_consulting",
                "security_training",
                "managed_security",
                "other",
            ],
            default: "other",
        },
        pricing: {
            type: {
                type: String,
                enum: ["fixed", "hourly", "monthly", "custom"],
                default: "custom",
            },
            amount: Number,
            currency: {
                type: String,
                default: "USD",
            },
        },
        duration: {
            value: Number,
            unit: {
                type: String,
                enum: ["hours", "days", "weeks", "months"],
                default: "hours",
            },
        },
        features: [String],
        deliverables: [String],
        requirements: [String],
        status: {
            type: String,
            enum: ["active", "inactive", "coming_soon"],
            default: "active",
        },
        popularity: {
            type: Number,
            default: 0,
        },
        rating: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },
            count: {
                type: Number,
                default: 0,
            },
        },
        tags: [String],
        icon: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Indexes
serviceSchema.index({ category: 1, status: 1 });
serviceSchema.index({ "rating.average": -1 });
serviceSchema.index({ popularity: -1 });

const Service = mongoose.model("Service", serviceSchema);

export default Service;
