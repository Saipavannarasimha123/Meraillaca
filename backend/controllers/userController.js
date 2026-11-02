// User Controller - thin HTTP adapter for user profile operations

const { getProfile, updateProfile } = require("../services/userService");
const { sendSuccess, sendError } = require("../utils/helpers");

/**
 * GET /api/users/profile
 * Get the logged-in user's profile
 */
const getProfileHandler = async (req, res) => {
  try {
    const safeUser = await getProfile(req.user.id);
    return sendSuccess(res, 200, "Profile fetched successfully", safeUser);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch profile");
  }
};

/**
 * PUT /api/users/profile
 * Update the logged-in user's profile
 */
const updateProfileHandler = async (req, res) => {
  try {
    const safeUser = await updateProfile(req.user.id, req.body);
    return sendSuccess(res, 200, "Profile updated successfully", safeUser);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to update profile");
  }
};

module.exports = { getProfile: getProfileHandler, updateProfile: updateProfileHandler };
