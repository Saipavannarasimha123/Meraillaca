// User Service - business logic for user profile management

const UserModel = require("../models/User");

/**
 * Strip the password field from a user object before returning it.
 * @param {Object} user
 * @returns {Object} user without password
 */
const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

/**
 * Fetch a user's profile by id.
 * @param {string} userId
 * @returns {Object} safe user object (no password)
 * @throws {Error} 404 if user not found
 */
const getProfile = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return sanitizeUser(user);
};

/**
 * Update a user's profile fields.
 * @param {string} userId
 * @param {Object} updates - { name?, email? }
 * @returns {Object} updated safe user object
 * @throws {Error} 400/404 on validation failures
 */
const updateProfile = async (userId, { name, email }) => {
  if (!name && !email) {
    const err = new Error("Provide at least one field to update (name or email)");
    err.statusCode = 400;
    throw err;
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const updateData = {};

  if (name) {
    updateData.name = name;
  }

  if (email) {
    // Ensure the new email isn't already taken by someone else
    const existing = await UserModel.findByEmail(email);
    if (existing && existing.id !== userId) {
      const err = new Error("Email is already in use by another account");
      err.statusCode = 400;
      throw err;
    }
    updateData.email = email;
  }

  const updatedUser = await UserModel.update(userId, updateData);
  return sanitizeUser(updatedUser);
};

module.exports = { getProfile, updateProfile, sanitizeUser };
