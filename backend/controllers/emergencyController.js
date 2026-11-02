// Emergency Controller - thin HTTP adapter for emergency report operations

const {
  getAllEmergencies,
  getEmergencyById,
  createEmergency,
} = require("../services/emergencyService");
const { sendSuccess, sendError } = require("../utils/helpers");

/**
 * GET /api/emergency
 * Get all emergency reports (protected)
 */
const getAllEmergenciesHandler = async (req, res) => {
  try {
    const emergencies = await getAllEmergencies();
    return sendSuccess(res, 200, "Emergency reports fetched successfully", emergencies);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch emergency reports");
  }
};

/**
 * GET /api/emergency/:id
 * Get a single emergency report by ID (protected)
 */
const getEmergencyByIdHandler = async (req, res) => {
  try {
    const emergency = await getEmergencyById(req.params.id);
    return sendSuccess(res, 200, "Emergency report fetched successfully", emergency);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch emergency report");
  }
};

/**
 * POST /api/emergency
 * Create a new emergency report (protected)
 */
const createEmergencyHandler = async (req, res) => {
  try {
    const emergency = await createEmergency(req.body, req.user.id);
    return sendSuccess(res, 201, "Emergency report submitted successfully", emergency);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to submit emergency report");
  }
};

module.exports = {
  getAllEmergencies: getAllEmergenciesHandler,
  getEmergencyById: getEmergencyByIdHandler,
  createEmergency: createEmergencyHandler,
};
