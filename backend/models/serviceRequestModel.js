import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
    {
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        organization: {
            name: String,
            industry: String,
            size: String,
        },
        contactInfo: {
            email: String,
            phone: String,
            preferredContact: {
                type: String,
                enum: ["email", "phone", "both"],
                default: "email",
            },
        },
        requirements: {
            type: String,
            required: true,
        },
        urgency: {
            type: String,
            enum: ["immediate", "high", "medium", "low"],
            default: "medium",
        },
        preferredStartDate: Date,
        budget: {
            min: Number,
            max: Number,
            currency: {
                type: String,
                default: "USD",
            },
        },
        status: {
            type: String,
            enum: [
                "pending",
                "reviewing",
                "approved",
                "in_progress",
                "completed",
                "rejected",
                "cancelled",
            ],
            default: "pending",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        notes: [
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
        quote: {
            amount: Number,
            currency: String,
            validUntil: Date,
            terms: String,
        },
        completionDetails: {
            completedAt: Date,
            deliverables: [String],
            feedback: String,
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
        },
    },
    { timestamps: true }
);

// Indexes
serviceRequestSchema.index({ status: 1, urgency: 1 });
serviceRequestSchema.index({ requestedBy: 1 });
serviceRequestSchema.index({ assignedTo: 1 });
serviceRequestSchema.index({ createdAt: -1 });

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

export default ServiceRequest;
