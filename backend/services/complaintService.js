// Complaint Service - business logic for resident complaints

const ComplaintModel = require("../models/Complaint");
const { COMPLAINT_STATUS } = require("../utils/constants");

/**
 * Retrieve all complaints.
 * @returns {Array} list of all complaints
 */
const getAllComplaints = async () => {
  return await ComplaintModel.findAll();
};

/**
 * Retrieve a single complaint by id.
 * @param {string} id
 * @returns {Object} complaint
 * @throws {Error} 404 if not found
 */
const getComplaintById = async (id) => {
  const complaint = await ComplaintModel.findById(id);
  if (!complaint) {
    const err = new Error("Complaint not found");
    err.statusCode = 404;
    throw err;
  }
  return complaint;
};

/**
 * Submit a new complaint.
 * @param {Object} data - { title, description }
 * @param {string} submittedBy - id of the user submitting the complaint
 * @returns {Object} newly created complaint
 * @throws {Error} 400 if required fields are missing
 */
const createComplaint = async ({ title, description }, submittedBy) => {
  if (!title || !description) {
    const err = new Error("Title and description are required");
    err.statusCode = 400;
    throw err;
  }

  return await ComplaintModel.create({
    title,
    description,
    submittedBy,
    status: COMPLAINT_STATUS.OPEN,
  });
};

/**
 * Update the status of a complaint (admin action).
 * @param {string} id - complaint id
 * @param {string} status - one of COMPLAINT_STATUS values
 * @returns {Object} updated complaint
 * @throws {Error} 400 for invalid status, 404 if not found
 */
const updateComplaintStatus = async (id, status) => {
  const validStatuses = Object.values(COMPLAINT_STATUS);
  if (!validStatuses.includes(status)) {
    const err = new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    err.statusCode = 400;
    throw err;
  }

  const complaint = await ComplaintModel.findById(id);
  if (!complaint) {
    const err = new Error("Complaint not found");
    err.statusCode = 404;
    throw err;
  }

  // Update status on the complaint object (works for both in-memory and Mongoose)
  complaint.status = status;

  return complaint;
};

module.exports = {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
};
