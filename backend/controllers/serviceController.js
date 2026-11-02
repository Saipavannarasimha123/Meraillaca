// Service Controller - thin HTTP adapter for local home/professional service operations

const {
  getAllServices,
  getServiceById,
  createService,
} = require("../services/localServiceService");
const { sendSuccess, sendError } = require("../utils/helpers");

/**
 * GET /api/services
 * Get all services (public)
 */
const getAllServicesHandler = async (req, res) => {
  try {
    const services = await getAllServices();
    return sendSuccess(res, 200, "Services fetched successfully", services);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch services");
  }
};

/**
 * GET /api/services/:id
 * Get a single service by ID (public)
 */
const getServiceByIdHandler = async (req, res) => {
  try {
    const service = await getServiceById(req.params.id);
    return sendSuccess(res, 200, "Service fetched successfully", service);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch service");
  }
};

/**
 * POST /api/services
 * List a new service (protected)
 */
const createServiceHandler = async (req, res) => {
  try {
    const service = await createService(req.body, req.user.id);
    return sendSuccess(res, 201, "Service listed successfully", service);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to list service");
  }
};

module.exports = {
  getAllServices: getAllServicesHandler,
  getServiceById: getServiceByIdHandler,
  createService: createServiceHandler,
};
