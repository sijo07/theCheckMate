import Issue from "../models/issueModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private
const getIssues = asyncHandler(async (req, res) => {
    const { type, priority, status, assignedTo, search } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    const issues = await Issue.find(filter)
        .populate("reportedBy", "username email")
        .populate("assignedTo", "username email")
        .populate("relatedIncident", "title type")
        .populate("relatedSolution", "title")
        .sort({ createdAt: -1 });

    res.json(issues);
});

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Private
const getIssueById = asyncHandler(async (req, res) => {
    const issue = await Issue.findById(req.params.id)
        .populate("reportedBy", "username email profilePic")
        .populate("assignedTo", "username email profilePic")
        .populate("relatedIncident")
        .populate("relatedSolution")
        .populate("comments.user", "username profilePic");

    if (!issue) {
        res.status(404).json({ message: "QUERY_FAILED: ISSUE_RECORD_NOT_FOUND" });
        return;
    }

    res.json(issue);
});

// @desc    Create issue
// @route   POST /api/issues
// @access  Private
const createIssue = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        type,
        priority,
        relatedIncident,
        tags,
        attachments,
        dueDate,
        estimatedHours,
    } = req.body;

    const issue = await Issue.create({
        title,
        description,
        type,
        priority,
        relatedIncident,
        tags,
        attachments,
        dueDate,
        estimatedHours,
        reportedBy: req.user._id,
    });

    // Emit socket event for real-time notification
    const io = req.app.get("io");
    if (io) {
        io.emit("newIssue", issue);
    }

    res.status(201).json(issue);
});

// @desc    Update issue
// @route   PUT /api/issues/:id
// @access  Private
const updateIssue = asyncHandler(async (req, res) => {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
        res.status(404).json({ message: "OVERRIDE_FAILED: ISSUE_RECORD_NOT_FOUND" });
        return;
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
        if (key !== "comments") {
            issue[key] = req.body[key];
        }
    });

    const updatedIssue = await issue.save();
    res.json(updatedIssue);
});

// @desc    Assign issue to user
// @route   PUT /api/issues/:id/assign
// @access  Private/Admin
const assignIssue = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
        res.status(404).json({ message: "ASSIGNMENT_FAILED: ISSUE_RECORD_NOT_FOUND" });
        return;
    }

    issue.assignedTo = userId;
    issue.status = "in_progress";

    const updatedIssue = await issue.save();

    // Emit socket event
    const io = req.app.get("io");
    if (io) {
        io.to(userId).emit("issueAssigned", updatedIssue);
    }

    res.json(updatedIssue);
});

// @desc    Add comment to issue
// @route   POST /api/issues/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
        res.status(404).json({ message: "COMLOG_FAILED: ISSUE_RECORD_NOT_FOUND" });
        return;
    }

    issue.comments.push({
        user: req.user._id,
        text,
    });

    const updatedIssue = await issue.save();
    res.json(updatedIssue);
});

// @desc    Resolve issue
// @route   PUT /api/issues/:id/resolve
// @access  Private
const resolveIssue = asyncHandler(async (req, res) => {
    const { description, relatedSolution, actualHours } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
        res.status(404).json({ message: "RESOLUTION_FAILED: ISSUE_RECORD_NOT_FOUND" });
        return;
    }

    issue.status = "resolved";
    issue.resolution = {
        description,
        resolvedBy: req.user._id,
        resolvedAt: new Date(),
    };
    if (relatedSolution) {
        issue.relatedSolution = relatedSolution;
    }
    if (actualHours) {
        issue.actualHours = actualHours;
    }

    const updatedIssue = await issue.save();
    res.json(updatedIssue);
});

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private/Admin
const deleteIssue = asyncHandler(async (req, res) => {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
        res.status(404).json({ message: "PURGE_FAILED: ISSUE_RECORD_NOT_FOUND" });
        return;
    }

    await Issue.deleteOne({ _id: req.params.id });
    res.json({ message: "ISSUE_RECORDS_PURGED_SUCCESSFULLY" });
});

export {
    getIssues,
    getIssueById,
    createIssue,
    updateIssue,
    assignIssue,
    addComment,
    resolveIssue,
    deleteIssue,
};
