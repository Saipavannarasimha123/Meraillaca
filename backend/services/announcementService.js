// Announcement Service - business logic for community announcements

const AnnouncementModel = require("../models/Announcement");

/**
 * Retrieve all announcements.
 * @returns {Array} list of all announcements
 */
const getAllAnnouncements = async () => {
  return await AnnouncementModel.findAll();
};

/**
 * Retrieve a single announcement by id.
 * @param {string} id
 * @returns {Object} announcement
 * @throws {Error} 404 if not found
 */
const getAnnouncementById = async (id) => {
  const announcement = await AnnouncementModel.findById(id);
  if (!announcement) {
    const err = new Error("Announcement not found");
    err.statusCode = 404;
    throw err;
  }
  return announcement;
};

/**
 * Create a new announcement.
 * @param {Object} data - { title, content }
 * @param {string} createdBy - id of the user creating the announcement
 * @returns {Object} newly created announcement
 * @throws {Error} 400 if required fields are missing
 */
const createAnnouncement = async ({ title, content }, createdBy) => {
  if (!title || !content) {
    const err = new Error("Title and content are required");
    err.statusCode = 400;
    throw err;
  }

  return await AnnouncementModel.create({
    title,
    content,
    createdBy: createdBy || "system",
  });
};

module.exports = { getAllAnnouncements, getAnnouncementById, createAnnouncement };
