import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import Service from "./models/serviceModel.js";
import Solution from "./models/solutionModel.js";
import Issue from "./models/issueModel.js";
import Incident from "./models/incidentModel.js";
import Report from "./models/reportModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const services = [
    {
        name: "Deep Packet Inspection",
        description: "Advanced analysis of network traffic at the application layer. Identity protocol anomalies and unauthorized payload signatures in real-time.",
        category: "threat_analysis",
        pricing: {
            type: "monthly",
            amount: 2500,
            currency: "USD"
        },
        duration: {
            value: 12,
            unit: "months"
        },
        features: ["Layer 7 Analysis", "Signature Matching", "Heuristic Anomaly Detection"],
        deliverables: ["Monthly Threat Report", "Real-time Alerts API"],
        status: "active",
        rating: { average: 4.8, count: 124 },
        tags: ["network", "traffic", "surveillance"]
    },
    {
        name: "Black Box Penetration Test",
        description: "Simulated adversary attack on your infrastructure without prior knowledge. Tests physical, social, and digital attack vectors.",
        category: "penetration_testing",
        pricing: {
            type: "fixed",
            amount: 15000,
            currency: "USD"
        },
        duration: {
            value: 4,
            unit: "weeks"
        },
        features: ["Zero-knowledge Attack", "Social Engineering", "Physical Breach Attempt"],
        deliverables: ["Exploit Chain Documentation", "Remediation Strategy"],
        status: "active",
        rating: { average: 5.0, count: 42 },
        tags: ["red_team", "offensive", "simulation"]
    },
    {
        name: "Zero-Day Vulnerability Scan",
        description: "Scanning of proprietary and open-source codebases for unknown vulnerabilities using AI-driven static analysis.",
        category: "vulnerability_assessment",
        pricing: {
            type: "hourly",
            amount: 300,
            currency: "USD"
        },
        duration: {
            value: 48,
            unit: "hours"
        },
        features: ["Static Analysis (SAST)", "Dependency Auditing", "AI Pattern Recognition"],
        deliverables: ["Vulnerability Manifest", "Patch Recommendations"],
        status: "active",
        rating: { average: 4.5, count: 89 },
        tags: ["code", "audit", "prevention"]
    },
    {
        name: "Incident Response Rapid Team",
        description: "24/7 Deployment of cyber-squads to contain, eradicate, and recover from active breaches. 1-hour SLA.",
        category: "incident_response",
        pricing: {
            type: "custom",
            amount: 0,
            currency: "USD"
        },
        duration: {
            value: 1,
            unit: "days"
        },
        features: ["Forensic Preservation", "Malware Reverse Engineering", "Legal Liaison"],
        deliverables: ["Root Cause Analysis", "Timeline of Compromise"],
        status: "active",
        rating: { average: 4.9, count: 215 },
        tags: ["emergency", "recovery", "forensics"]
    },
    {
        name: "Compliance Architecture Audit",
        description: "Complete mapping of infrastructure against ISO 27001, SOC2, and GDPR standards with automated gap analysis.",
        category: "compliance_consulting",
        pricing: {
            type: "fixed",
            amount: 5000,
            currency: "USD"
        },
        duration: {
            value: 2,
            unit: "weeks"
        },
        features: ["Gap Analysis", "Policy Generation", "Automated Evidence Collection"],
        deliverables: ["Certification Readiness Report", "Compliance Dashboard"],
        status: "active",
        rating: { average: 4.2, count: 67 },
        tags: ["legal", "audit", "governance"]
    },
    {
        name: "Red Team Bootcamp",
        description: "Intensive 5-day training for internal security teams on offensive cyber tactics, exploit development, and evasion.",
        category: "security_training",
        pricing: {
            type: "fixed",
            amount: 3500,
            currency: "USD"
        },
        duration: {
            value: 5,
            unit: "days"
        },
        features: ["Live Fire Range", "Custom Exploit Dev", "C2 Infrastructure Setup"],
        deliverables: ["Course Completion Cert", "Tactical Playbook"],
        status: "active",
        rating: { average: 4.7, count: 103 },
        tags: ["training", "offensive", "education"]
    }
];

const solutions = [
    {
        title: "WannaCry Ransomware Killswitch",
        description: "Deploy automated domain sinkhole registration to neutralize SMB propagation vectors associated with WannaCry/EternalBlue.",
        category: "malware_removal",
        severity: "critical",
        status: "published",
        effectiveness: 99.9,
        appliedCount: 4521,
        tags: ["ransomware", "smb", "killswitch"],
        location: "GLOBAL_DNS_ROOT"
    },
    {
        title: "Log4Shell Vaccination",
        description: "Hot-patch JVM environment variables to disable JNDI lookup functionality, preventing RCE without restarting services.",
        category: "vulnerability_patch",
        severity: "critical",
        status: "published",
        effectiveness: 100,
        appliedCount: 12056,
        tags: ["java", "rce", "zero-day"],
        location: "SERVER_FARM_ALPHA"
    },
    {
        title: "SSH Hardening Config",
        description: "Disables root login, enforces key-based auth, and updates cipher suites to comply with NIST standards.",
        category: "security_config",
        severity: "high",
        status: "published",
        effectiveness: 95.5,
        appliedCount: 890,
        tags: ["linux", "compliance", "hardening"],
        location: "LINUX_CLUSTER_04"
    },
    {
        title: "SQL Injection Firewalls Rule",
        description: "WAF configuration block for common SQLi patterns including union-based and boolean-blind attacks.",
        category: "threat_mitigation",
        severity: "high",
        status: "published",
        effectiveness: 88.0,
        appliedCount: 2310,
        tags: ["web", "database", "waf"],
        location: "EDGE_GATEWAY_NY"
    },
    {
        title: "DDoS Rate Limiting Script",
        description: "Nginx configuration for intelligent IP throttling and user-agent filtering to mitigate Layer 7 floods.",
        category: "threat_mitigation",
        severity: "medium",
        status: "published",
        effectiveness: 92.3,
        appliedCount: 567,
        tags: ["network", "ddos", "nginx"],
        location: "CDN_NODE_APAC"
    },
    {
        title: "GDPR Cookie Consent Module",
        description: "Lightweight script to enforce prior consent for tracking cookies, ensuring EU compliance.",
        category: "compliance_fix",
        severity: "low",
        status: "published",
        effectiveness: 100,
        appliedCount: 340,
        tags: ["legal", "privacy", "web"],
        location: "EU_FRONTEND_SVCS"
    }
];

const issues = [
    {
        title: "UNAUTHORIZED_ROOT_ACCESS_DETECTED",
        description: "Anomaly detected in kernel modules. Root privilege escalation attempt blocked. Origin: 192.168.1.105 via SSH.",
        type: "security_vulnerability",
        priority: "critical",
        status: "open",
        tags: ["intrusion", "rootkit"],
    },
    {
        title: "FIREWALL_PENETRATION_SECTOR_7",
        description: "Port 443 flood detected. IPS signature match: APT29_BEACON. Mitigating via automatic shunting.",
        type: "security_vulnerability",
        priority: "high",
        status: "in_progress",
        tags: ["network", "apt"],
    },
    {
        title: "API_LATENCY_SPIKE_CORE",
        description: "95th percentile latency exceeded 500ms threshold on /auth endpoints. Possible credential stuffing attack.",
        type: "performance_issue",
        priority: "medium",
        status: "open",
        tags: ["performance", "dos"],
    },
    {
        title: "DATA_EXFILTRATION_FLAG",
        description: "Outbound traffic to known malicious IP (103.45.xx.xx) detected from Database Cluster Primary.",
        type: "security_vulnerability",
        priority: "critical",
        status: "in_progress",
        tags: ["dlp", "breach"],
    },
    {
        title: "SSL_CERT_EXPIRY_WARNING",
        description: "Certificate for *.secure.corp expiring in 48 hours. Auto-renewal failed due to DNS validation timeout.",
        type: "configuration_error",
        priority: "high",
        status: "open",
        tags: ["compliance", "ssl"],
    }
];

// Generate synthetic incidents for the map
const generateIncidents = () => {
    const types = ["DDoS", "Phishing", "Malware", "Ransomware", "Unauthorized Access"];
    const vectors = ["Phishing", "Malware", "Exploits", "DDoS", "Insider Threat"];
    const countries = ["USA", "China", "Russia", "Brazil", "Germany", "India", "UK"];
    const data = [];

    for (let i = 0; i < 50; i++) {
        data.push({
            title: `INCIDENT_${Math.floor(Math.random() * 10000)}`,
            description: "Automated threat telemetry.",
            date: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)),
            type: types[Math.floor(Math.random() * types.length)],
            source: {
                country: countries[Math.floor(Math.random() * countries.length)],
                lat: (Math.random() * 180) - 90,
                lng: (Math.random() * 360) - 180
            },
            target: {
                country: countries[Math.floor(Math.random() * countries.length)],
                lat: (Math.random() * 180) - 90,
                lng: (Math.random() * 360) - 180
            },
            industry: "Technology",
            attackVector: vectors[Math.floor(Math.random() * vectors.length)],
            sourceType: "Cybercriminal"
        });
    }
    return data;
};

const importData = async () => {
    try {
        await Service.deleteMany();
        await Solution.deleteMany();
        await Issue.deleteMany();
        await Incident.deleteMany();
        await Report.deleteMany();

        let user = await User.findOne({ isAdmin: true });

        if (!user) {
            console.log("⚠️ No admin found. Creating 'Commander' (admin@cyber.com)...");
            const salt = await import("bcryptjs").then(bcrypt => bcrypt.genSalt(10));
            const hashedPassword = await import("bcryptjs").then(bcrypt => bcrypt.hash("123456", salt));

            user = await User.create({
                username: "Commander",
                email: "admin@cyber.com",
                password: hashedPassword,
                phone: "0000000000",
                isAdmin: true,
                profilePic: "https://i.imgur.com/8Km9tLL.png"
            });
        }

        const sampleServices = services.map((service) => ({ ...service, createdBy: user._id }));
        const sampleSolutions = solutions.map((solution) => ({ ...solution, createdBy: user._id }));
        const sampleIssues = issues.map((issue) => ({ ...issue, reportedBy: user._id }));
        const sampleIncidents = generateIncidents();

        await Service.insertMany(sampleServices);
        await Solution.insertMany(sampleSolutions);
        await Issue.insertMany(sampleIssues);
        await Incident.insertMany(sampleIncidents);

        // Seed a sample report
        await Report.create({
            user: user._id,
            title: "MONTHLY_THREAT_ANALYSIS",
            type: "threat_analysis",
            dateRange: {
                start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                end: new Date()
            },
            status: "completed",
            metadata: {
                incidentCount: 50,
                generatedAt: new Date(),
                fileSize: 1024
            }
        });

        console.log("✅ Data Hydrated: Tactical Systems Online.");
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Service.deleteMany();
        await Solution.deleteMany();
        await Issue.deleteMany();
        await Incident.deleteMany();
        await Report.deleteMany();

        console.log("⚠️ Data Purged: Systems Cleared.");
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}
