import Solution from "../models/solutionModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// @desc    Get all solutions
// @route   GET /api/solutions
// @access  Private
const getSolutions = asyncHandler(async (req, res) => {
    const { category, severity, status, search } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } },
        ];
    }

    const solutions = await Solution.find(filter)
        .populate("createdBy", "username email")
        .populate("lastUpdatedBy", "username email")
        .populate("relatedIncident", "title type")
        .sort({ createdAt: -1 });

    res.json(solutions);
});

// @desc    Get single solution
// @route   GET /api/solutions/:id
// @access  Private
const getSolutionById = asyncHandler(async (req, res) => {
    const solution = await Solution.findById(req.params.id)
        .populate("createdBy", "username email")
        .populate("lastUpdatedBy", "username email")
        .populate("relatedIncident");

    if (!solution) {
        res.status(404);
        throw new Error("Solution not found");
    }

    res.json(solution);
});

// @desc    Create solution
// @route   POST /api/solutions
// @access  Private
const createSolution = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        category,
        severity,
        relatedIncident,
        steps,
        tags,
        attachments,
    } = req.body;

    const solution = await Solution.create({
        title,
        description,
        category,
        severity,
        relatedIncident,
        steps,
        tags,
        attachments,
        createdBy: req.user._id,
    });

    res.status(201).json(solution);
});

// @desc    Update solution
// @route   PUT /api/solutions/:id
// @access  Private
const updateSolution = asyncHandler(async (req, res) => {
    const solution = await Solution.findById(req.params.id);

    if (!solution) {
        res.status(404);
        throw new Error("Solution not found");
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
        solution[key] = req.body[key];
    });
    solution.lastUpdatedBy = req.user._id;

    const updatedSolution = await solution.save();
    res.json(updatedSolution);
});

// @desc    Delete solution
// @route   DELETE /api/solutions/:id
// @access  Private/Admin
const deleteSolution = asyncHandler(async (req, res) => {
    const solution = await Solution.findById(req.params.id);

    if (!solution) {
        res.status(404);
        throw new Error("Solution not found");
    }

    await Solution.deleteOne({ _id: req.params.id });
    res.json({ message: "Solution deleted successfully" });
});

// @desc    Mark solution as applied
// @route   POST /api/solutions/:id/apply
// @access  Private
const applySolution = asyncHandler(async (req, res) => {
    const solution = await Solution.findById(req.params.id);

    if (!solution) {
        res.status(404);
        throw new Error("Solution not found");
    }

    solution.appliedCount += 1;
    await solution.save();

    res.json({ message: "Solution applied", appliedCount: solution.appliedCount });
});

// @desc    Rate solution effectiveness
// @route   POST /api/solutions/:id/rate
// @access  Private
const rateSolution = asyncHandler(async (req, res) => {
    const { effectiveness } = req.body;
    const solution = await Solution.findById(req.params.id);

    if (!solution) {
        res.status(404);
        throw new Error("Solution not found");
    }

    if (effectiveness < 0 || effectiveness > 100) {
        res.status(400);
        throw new Error("Effectiveness must be between 0 and 100");
    }

    // Calculate new average effectiveness
    const totalRatings = solution.appliedCount || 1;
    const currentTotal = solution.effectiveness * (totalRatings - 1);
    solution.effectiveness = Math.round((currentTotal + effectiveness) / totalRatings);

    await solution.save();

    res.json({ message: "Solution rated", effectiveness: solution.effectiveness });
});

export {
    getSolutions,
    getSolutionById,
    createSolution,
    updateSolution,
    deleteSolution,
    applySolution,
    rateSolution,
};
