// Complaint Controller - thin HTTP adapter for complaint operations

const {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
} = require("../services/complaintService");
const { sendSuccess, sendError } = require("../utils/helpers");

/**
 * GET /api/complaints
 * Get all complaints (protected)
 */
const getAllComplaintsHandler = async (req, res) => {
  try {
    const complaints = await getAllComplaints();
    return sendSuccess(res, 200, "Complaints fetched successfully", complaints);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch complaints");
  }
};

/**
 * GET /api/complaints/:id
 * Get a single complaint by ID (protected)
 */
const getComplaintByIdHandler = async (req, res) => {
  try {
    const complaint = await getComplaintById(req.params.id);
    return sendSuccess(res, 200, "Complaint fetched successfully", complaint);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch complaint");
  }
};

/**
 * POST /api/complaints
 * Submit a new complaint (protected)
 */
const createComplaintHandler = async (req, res) => {
  try {
    const complaint = await createComplaint(req.body, req.user.id);
    return sendSuccess(res, 201, "Complaint submitted successfully", complaint);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to submit complaint");
  }
};

/**
 * PATCH /api/complaints/:id/status
 * Update complaint status (admin only)
 */
const updateComplaintStatusHandler = async (req, res) => {
  try {
    const complaint = await updateComplaintStatus(req.params.id, req.body.status);
    return sendSuccess(res, 200, "Complaint status updated successfully", complaint);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to update complaint status");
  }
};

module.exports = {
  getAllComplaints: getAllComplaintsHandler,
  getComplaintById: getComplaintByIdHandler,
  createComplaint: createComplaintHandler,
  updateComplaintStatus: updateComplaintStatusHandler,
};
