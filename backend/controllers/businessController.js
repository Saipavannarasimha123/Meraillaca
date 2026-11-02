// Business Controller - thin HTTP adapter for local business operations

const {
  getAllBusinesses,
  getBusinessById,
  createBusiness,
} = require("../services/businessService");
const { sendSuccess, sendError } = require("../utils/helpers");

/**
 * GET /api/businesses
 * Get all businesses (public)
 */
const getAllBusinessesHandler = async (req, res) => {
  try {
    const businesses = await getAllBusinesses();
    return sendSuccess(res, 200, "Businesses fetched successfully", businesses);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch businesses");
  }
};

/**
 * GET /api/businesses/:id
 * Get a single business by ID (public)
 */
const getBusinessByIdHandler = async (req, res) => {
  try {
    const business = await getBusinessById(req.params.id);
    return sendSuccess(res, 200, "Business fetched successfully", business);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch business");
  }
};

/**
 * POST /api/businesses
 * Register a new business (protected)
 */
const createBusinessHandler = async (req, res) => {
  try {
    const business = await createBusiness(req.body, req.user.id);
    return sendSuccess(res, 201, "Business registered successfully", business);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to register business");
  }
};

module.exports = {
  getAllBusinesses: getAllBusinessesHandler,
  getBusinessById: getBusinessByIdHandler,
  createBusiness: createBusinessHandler,
};
