// config/jwt.js
// Helper functions for generating and verifying JSON Web Tokens (JWT).

const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token for a given user ID and role.
 * @param {string} userId - The ID of the user
 * @param {string} userRole - The role of the user (e.g. "resident", "admin")
 * @returns {string} Signed JWT token
 */
const generateToken = (userId, userRole) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in your .env file.");
  }

  return jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/**
 * Verify a JWT token and return the decoded payload.
 * @param {string} token - The JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in your .env file.");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
