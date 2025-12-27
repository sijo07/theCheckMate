import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "No details available", trim: true },
    date: { type: Date, default: Date.now },
    type: {
      type: String,
      required: true,
      enum: [
        "DDoS",
        "Phishing",
        "Malware",
        "Ransomware",
        "Unauthorized Access",
        "Unknown",
      ],
    },
    severity: {
      type: String,
      default: "medium",
      enum: ["low", "medium", "high", "critical"],
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
    source: {
      country: { type: String, required: true, trim: true },
      lat: { type: Number, min: -90, max: 90, required: true },
      lng: { type: Number, min: -180, max: 180, required: true },
    },
    target: {
      country: { type: String, required: true, trim: true },
      lat: { type: Number, min: -90, max: 90, required: true },
      lng: { type: Number, min: -180, max: 180, required: true },
    },
    industry: { type: String, default: "General", trim: true },
    attackVector: {
      type: String,
      default: "Unknown",
      enum: [
        "Phishing",
        "Malware",
        "Exploits",
        "DDoS",
        "Insider Threat",
        "Unknown",
      ],
    },
    sourceType: {
      type: String,
      default: "Unknown",
      enum: [
        "Government",
        "Hacker Group",
        "Insider Threat",
        "Cybercriminal",
        "Unknown",
      ],
    },
  },
  { timestamps: true }
);

IncidentSchema.index({ date: 1 }, { expireAfterSeconds: 600 });

const Incident = mongoose.model("Incident", IncidentSchema);

export default Incident;
