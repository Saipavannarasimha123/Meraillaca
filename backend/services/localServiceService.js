// Local Service Service - business logic for local/home services (plumbers, electricians, etc.)

const ServiceModel = require("../models/Service");

/**
 * Retrieve all local services.
 * @returns {Array} list of all services
 */
const getAllServices = async () => {
  return await ServiceModel.findAll();
};

/**
 * Retrieve a single service by id.
 * @param {string} id
 * @returns {Object} service
 * @throws {Error} 404 if not found
 */
const getServiceById = async (id) => {
  const service = await ServiceModel.findById(id);
  if (!service) {
    const err = new Error("Service not found");
    err.statusCode = 404;
    throw err;
  }
  return service;
};

/**
 * List a new local service offering.
 * @param {Object} data - { name, category, description, contactNumber }
 * @param {string} providerId - id of the user offering the service
 * @returns {Object} newly created service
 * @throws {Error} 400 if required fields are missing
 */
const createService = async ({ name, category, description, contactNumber }, providerId) => {
  if (!name || !category || !description || !contactNumber) {
    const err = new Error("Name, category, description, and contact number are required");
    err.statusCode = 400;
    throw err;
  }

  return await ServiceModel.create({
    name,
    category,
    description,
    contactNumber,
    providerId,
  });
};

module.exports = { getAllServices, getServiceById, createService };
