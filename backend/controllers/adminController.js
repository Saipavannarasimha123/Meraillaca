// Admin Controller - thin HTTP adapter for admin operations

const { getAllUsers, getDashboardStats } = require("../services/adminService");
const { sendSuccess, sendError } = require("../utils/helpers");

/**
 * GET /api/admin/users
 * Get all registered users (admin only)
 */
const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsers();
    return sendSuccess(res, 200, "Users fetched successfully", users);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch users");
  }
};

/**
 * GET /api/admin/dashboard
 * Get aggregated dashboard statistics (admin only)
 */
const getDashboardHandler = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    return sendSuccess(res, 200, stats.message, stats);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch dashboard data");
  }
};

module.exports = {
  getAllUsers: getAllUsersHandler,
  getDashboard: getDashboardHandler,
};
