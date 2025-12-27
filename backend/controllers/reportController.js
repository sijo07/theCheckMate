import asyncHandler from "../middlewares/asyncHandler.js";
import Report from "../models/reportModel.js";
import Incident from "../models/incidentModel.js";

// @desc    Get all reports for logged-in user
// @route   GET /api/reports
// @access  Private
const getReports = asyncHandler(async (req, res) => {
    const reports = await Report.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);

    res.json(reports);
});

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
const getReportById = asyncHandler(async (req, res) => {
    const report = await Report.findById(req.params.id);

    if (!report) {
        res.status(404).json({ message: "QUERY_FAILED: REPORT_NOT_FOUND" });
        return;
    }

    // Check if report belongs to user or user is admin
    if (
        report.user.toString() !== req.user._id.toString() &&
        !req.user.isAdmin
    ) {
        res.status(403).json({ message: "ACCESS_DENIED: UNAUTHORIZED_DATA_REQUEST" });
        return;
    }

    res.json(report);
});

// @desc    Create/Generate report
// @route   POST /api/reports
// @access  Private
const createReport = asyncHandler(async (req, res) => {
    const { title, type, dateRange, filters, format, schedule } = req.body;

    // Validate date range
    if (!dateRange || !dateRange.start || !dateRange.end) {
        res.status(400).json({ message: "VALIDATION_ERROR: TEMPORAL_PARAMETERS_REQUIRED" });
        return;
    }

    const report = await Report.create({
        user: req.user._id,
        title,
        type,
        dateRange,
        filters: filters || {},
        format: format || "pdf",
        schedule: schedule || { enabled: false },
        status: "pending",
    });

    // Start report generation in background
    generateReportData(report._id);

    res.status(201).json(report);
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = asyncHandler(async (req, res) => {
    const report = await Report.findById(req.params.id);

    if (!report) {
        res.status(404).json({ message: "PURGE_FAILED: REPORT_NOT_FOUND" });
        return;
    }

    // Check if report belongs to user
    if (report.user.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: "ACCESS_DENIED: UNAUTHORIZED_PURGE_REQUEST" });
        return;
    }

    await report.deleteOne();

    res.json({ message: "REPORT_PURGED_SUCCESSFULLY" });
});

// @desc    Get report data/preview
// @route   GET /api/reports/:id/data
// @access  Private
const getReportData = asyncHandler(async (req, res) => {
    const report = await Report.findById(req.params.id);

    if (!report) {
        res.status(404).json({ message: "QUERY_FAILED: REPORT_NOT_FOUND" });
        return;
    }

    // Check if report belongs to user or user is admin
    if (
        report.user.toString() !== req.user._id.toString() &&
        !req.user.isAdmin
    ) {
        res.status(403).json({ message: "ACCESS_DENIED: UNAUTHORIZED_DATA_REQUEST" });
        return;
    }

    // Get incidents based on report filters
    const query = {
        date: {
            $gte: new Date(report.dateRange.start),
            $lte: new Date(report.dateRange.end),
        },
    };

    if (report.filters.incidentTypes?.length > 0) {
        query.type = { $in: report.filters.incidentTypes };
    }

    if (report.filters.countries?.length > 0) {
        query["target.country"] = { $in: report.filters.countries };
    }

    if (report.filters.industries?.length > 0) {
        query.industry = { $in: report.filters.industries };
    }

    const incidents = await Incident.find(query).sort({ date: -1 });

    // Generate statistics
    const stats = {
        totalIncidents: incidents.length,
        byType: {},
        byCountry: {},
        byIndustry: {},
        byAttackVector: {},
    };

    incidents.forEach((incident) => {
        // Count by type
        stats.byType[incident.type] = (stats.byType[incident.type] || 0) + 1;

        // Count by country
        stats.byCountry[incident.target.country] =
            (stats.byCountry[incident.target.country] || 0) + 1;

        // Count by industry
        stats.byIndustry[incident.industry] =
            (stats.byIndustry[incident.industry] || 0) + 1;

        // Count by attack vector
        stats.byAttackVector[incident.attackVector] =
            (stats.byAttackVector[incident.attackVector] || 0) + 1;
    });

    res.json({
        report,
        incidents,
        stats,
    });
});

// Helper function to generate report data (would run in background)
const generateReportData = async (reportId) => {
    try {
        const report = await Report.findById(reportId);
        if (!report) return;

        // Update status to processing
        report.status = "processing";
        await report.save();

        // Get incidents based on filters
        const query = {
            date: {
                $gte: new Date(report.dateRange.start),
                $lte: new Date(report.dateRange.end),
            },
        };

        if (report.filters.incidentTypes?.length > 0) {
            query.type = { $in: report.filters.incidentTypes };
        }

        const incidents = await Incident.find(query);

        // Update report metadata
        report.metadata = {
            incidentCount: incidents.length,
            generatedAt: new Date(),
        };
        report.status = "completed";

        // In a real implementation, you would generate the actual file here
        // and upload it to cloud storage, then set report.fileUrl

        await report.save();
    } catch (error) {
        console.error("Error generating report:", error);
        const report = await Report.findById(reportId);
        if (report) {
            report.status = "failed";
            await report.save();
        }
    }
};

export {
    getReports,
    getReportById,
    createReport,
    deleteReport,
    getReportData,
};
