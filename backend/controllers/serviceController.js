import Service from "../models/serviceModel.js";
import ServiceRequest from "../models/serviceRequestModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
    const { category, status, search } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } },
        ];
    }

    const services = await Service.find(filter)
        .populate("createdBy", "username email")
        .sort({ popularity: -1, "rating.average": -1 });

    res.json(services);
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id).populate(
        "createdBy",
        "username email"
    );

    if (!service) {
        res.status(404).json({ message: "QUERY_FAILED: SERVICE_RECORD_NOT_FOUND" });
        return;
    }

    // Increment popularity
    service.popularity += 1;
    await service.save();

    res.json(service);
});

// @desc    Create service
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category,
        pricing,
        duration,
        features,
        deliverables,
        requirements,
        tags,
        icon,
    } = req.body;

    const service = await Service.create({
        name,
        description,
        category,
        pricing,
        duration,
        features,
        deliverables,
        requirements,
        tags,
        icon,
        createdBy: req.user._id,
    });

    res.status(201).json(service);
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404).json({ message: "OVERRIDE_FAILED: SERVICE_RECORD_NOT_FOUND" });
        return;
    }

    Object.keys(req.body).forEach((key) => {
        service[key] = req.body[key];
    });

    const updatedService = await service.save();
    res.json(updatedService);
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404).json({ message: "PURGE_FAILED: SERVICE_RECORD_NOT_FOUND" });
        return;
    }

    await Service.deleteOne({ _id: req.params.id });
    res.json({ message: "SERVICE_RECORDS_PURGED_SUCCESSFULLY" });
});

// @desc    Get all service requests
// @route   GET /api/services/requests
// @access  Private
// @desc    Get all service requests
// @route   GET /api/services/requests
// @access  Private
const getServiceRequests = asyncHandler(async (req, res) => {
    const { status, urgency } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;

    // If not admin, only show own requests
    if (req.user && !req.user.isAdmin) {
        filter.requestedBy = req.user._id;
    } else if (!req.user) {
        res.status(401);
        throw new Error("Not authorized");
    }

    const requests = await ServiceRequest.find(filter)
        .populate("service", "name category")
        .populate("requestedBy", "username email")
        .populate("assignedTo", "username email")
        .sort({ createdAt: -1 });

    res.json(requests);
});

// @desc    Get pending service requests (Authorizations)
// @route   GET /api/services/requests/pending
// @access  Private/Admin
const getPendingAuthorizations = asyncHandler(async (req, res) => {
    const requests = await ServiceRequest.find({ status: "pending" })
        .populate("service", "name category")
        .populate("requestedBy", "username email")
        .sort({ createdAt: 1 }); // Oldest first for queue handling

    res.json(requests);
});

// @desc    Get single service request
// @route   GET /api/services/requests/:id
// @access  Private
const getServiceRequestById = asyncHandler(async (req, res) => {
    const request = await ServiceRequest.findById(req.params.id)
        .populate("service")
        .populate("requestedBy", "username email phone")
        .populate("assignedTo", "username email")
        .populate("notes.user", "username profilePic");

    if (!request) {
        res.status(404).json({ message: "QUERY_FAILED: SERVICE_REQUEST_NOT_FOUND" });
        return;
    }

    // Authorization check
    if (!req.user.isAdmin && request.requestedBy._id.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: "ACCESS_DENIED: UNAUTHORIZED_REQUEST_ACCESS" });
        return;
    }

    res.json(request);
});

// @desc    Create service request
// @route   POST /api/services/requests
// @access  Private
const createServiceRequest = asyncHandler(async (req, res) => {
    const {
        service,
        organization,
        contactInfo,
        requirements,
        urgency,
        preferredStartDate,
        budget,
    } = req.body;

    const serviceRequest = await ServiceRequest.create({
        service,
        organization,
        contactInfo,
        requirements,
        urgency,
        preferredStartDate,
        budget,
        requestedBy: req.user._id,
    });

    // Emit socket event for admins
    const io = req.app.get("io");
    if (io) {
        io.emit("newServiceRequest", serviceRequest);
    }

    // TRIGGER NOTIFICATION FOR ADMINS
    const adminUsers = await User.find({ isAdmin: true });
    const notifications = adminUsers.map(admin => ({
        user: admin._id,
        type: 'info',
        title: 'NEW PROTOCOL REQUEST',
        message: `Operative has requested: ${req.body.service || 'Unknown Service'}`, // Optimistic service name or ID
        metadata: { requestId: serviceRequest._id }
    }));
    if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        // Real-time emit
        if (io) {
            adminUsers.forEach(admin => {
                io.to(admin._id.toString()).emit("notification", {
                    title: 'NEW PROTOCOL REQUEST',
                    message: `Operative has requested new service`,
                    type: 'info'
                });
            });
        }
    }

    res.status(201).json(serviceRequest);
});

// @desc    Update service request
// @route   PUT /api/services/requests/:id
// @access  Private/Admin
const updateServiceRequest = asyncHandler(async (req, res) => {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
        res.status(404).json({ message: "OVERRIDE_FAILED: SERVICE_REQUEST_NOT_FOUND" });
        return;
    }

    // Check authorization: Admin or Owner
    if (!req.user.isAdmin && request.requestedBy.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: "ACCESS_DENIED: UNAUTHORIZED_REQUEST_MODIFICATION" });
        return;
    }

    Object.keys(req.body).forEach((key) => {
        // Restrict fields for non-admins
        if (!req.user.isAdmin) {
            const allowedUpdates = ["requirements", "contactInfo", "organization", "urgency", "preferredStartDate", "budget"];
            // Allow status update ONLY if cancelling
            if (key === "status" && req.body.status === "cancelled") {
                // allow
            } else if (!allowedUpdates.includes(key)) {
                return;
            }
        }

        if (key !== "notes") {
            request[key] = req.body[key];
        }
    });

    const updatedRequest = await request.save();

    // TRIGGER NOTIFICATION FOR USER IF STATUS CHANGED
    if (req.body.status && req.body.status !== request.status) {
        const io = req.app.get("io");
        const notification = await Notification.create({
            user: request.requestedBy,
            type: req.body.status === 'approved' ? 'success' : req.body.status === 'rejected' ? 'warning' : 'info',
            title: `PROTOCOL UPDATE: ${req.body.status.toUpperCase()}`,
            message: `Your service request status has been updated to ${req.body.status}.`,
            metadata: { requestId: updatedRequest._id }
        });

        if (io) {
            io.to(request.requestedBy.toString()).emit("notification", notification);
        }
    }

    res.json(updatedRequest);
});

// @desc    Add note to service request
// @route   POST /api/services/requests/:id/notes
// @access  Private
const addNoteToRequest = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
        res.status(404).json({ message: "COMLOG_FAILED: SERVICE_REQUEST_NOT_FOUND" });
        return;
    }

    request.notes.push({
        user: req.user._id,
        text,
    });

    const updatedRequest = await request.save();
    res.json(updatedRequest);
});

// @desc    Complete service request
// @route   PUT /api/services/requests/:id/complete
// @access  Private/Admin
const completeServiceRequest = asyncHandler(async (req, res) => {
    const { deliverables, feedback, rating } = req.body;
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
        res.status(404).json({ message: "RESOLUTION_FAILED: SERVICE_REQUEST_NOT_FOUND" });
        return;
    }

    request.status = "completed";
    request.completionDetails = {
        completedAt: new Date(),
        deliverables,
        feedback,
        rating,
    };

    // Update service rating
    if (rating) {
        const service = await Service.findById(request.service);
        if (service) {
            const totalRatings = service.rating.count;
            const currentTotal = service.rating.average * totalRatings;
            service.rating.average = (currentTotal + rating) / (totalRatings + 1);
            service.rating.count += 1;
            await service.save();
        }
    }

    const updatedRequest = await request.save();
    res.json(updatedRequest);
});

export {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getServiceRequests,
    getServiceRequestById,
    createServiceRequest,
    updateServiceRequest,
    addNoteToRequest,
    completeServiceRequest,
    getPendingAuthorizations,
};
