// Business Service - business logic for local businesses

const BusinessModel = require("../models/Business");

/**
 * Retrieve all businesses.
 * @returns {Array} list of all businesses
 */
const getAllBusinesses = async () => {
  return await BusinessModel.findAll();
};

/**
 * Retrieve a single business by id.
 * @param {string} id
 * @returns {Object} business
 * @throws {Error} 404 if not found
 */
const getBusinessById = async (id) => {
  const business = await BusinessModel.findById(id);
  if (!business) {
    const err = new Error("Business not found");
    err.statusCode = 404;
    throw err;
  }
  return business;
};

/**
 * Register a new local business.
 * @param {Object} data - { name, category, address, phone }
 * @param {string} ownerId - id of the user registering the business
 * @returns {Object} newly created business
 * @throws {Error} 400 if required fields are missing
 */
const createBusiness = async ({ name, category, address, phone }, ownerId) => {
  if (!name || !category || !address || !phone) {
    const err = new Error("Name, category, address, and phone are required");
    err.statusCode = 400;
    throw err;
  }

  return await BusinessModel.create({
    name,
    category,
    address,
    phone,
    ownerId,
  });
};

module.exports = { getAllBusinesses, getBusinessById, createBusiness };
