// Emergency Service - business logic for emergency reports

const EmergencyModel = require("../models/Emergency");

/**
 * Retrieve all emergency reports.
 * @returns {Array} list of all emergencies
 */
const getAllEmergencies = async () => {
  return await EmergencyModel.findAll();
};

/**
 * Retrieve a single emergency report by id.
 * @param {string} id
 * @returns {Object} emergency report
 * @throws {Error} 404 if not found
 */
const getEmergencyById = async (id) => {
  const emergency = await EmergencyModel.findById(id);
  if (!emergency) {
    const err = new Error("Emergency report not found");
    err.statusCode = 404;
    throw err;
  }
  return emergency;
};

/**
 * Create a new emergency report.
 * @param {Object} data - { type, description, location }
 * @param {string} reportedBy - id of the user reporting
 * @returns {Object} newly created emergency report
 * @throws {Error} 400 if required fields are missing
 */
const createEmergency = async ({ type, description, location }, reportedBy) => {
  if (!type || !description || !location) {
    const err = new Error("Type, description, and location are required");
    err.statusCode = 400;
    throw err;
  }

  return await EmergencyModel.create({
    type,
    description,
    location,
    reportedBy,
  });
};

module.exports = { getAllEmergencies, getEmergencyById, createEmergency };
