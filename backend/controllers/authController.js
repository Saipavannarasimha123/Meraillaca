// Auth Controller - thin HTTP adapter for auth operations

const { registerUser, loginUser } = require("../services/authService");
const { sendSuccess, sendError } = require("../utils/helpers");

/**
 * POST /api/auth/register
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    return sendSuccess(res, 201, "User registered successfully", result);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Registration failed");
  }
};

/**
 * POST /api/auth/login
 * Login a user with email and password
 */
const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    return sendSuccess(res, 200, "Login successful", result);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Login failed");
  }
};

module.exports = { register, login };
