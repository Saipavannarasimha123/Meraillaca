// Announcement Controller - thin HTTP adapter for announcement operations

const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
} = require("../services/announcementService");
const { sendSuccess, sendError } = require("../utils/helpers");

/**
 * GET /api/announcements
 * Get all announcements (public)
 */
const getAllAnnouncementsHandler = async (req, res) => {
  try {
    const announcements = await getAllAnnouncements();
    return sendSuccess(res, 200, "Announcements fetched successfully", announcements);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch announcements");
  }
};

/**
 * GET /api/announcements/:id
 * Get a single announcement by ID (public)
 */
const getAnnouncementByIdHandler = async (req, res) => {
  try {
    const announcement = await getAnnouncementById(req.params.id);
    return sendSuccess(res, 200, "Announcement fetched successfully", announcement);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch announcement");
  }
};

/**
 * POST /api/announcements
 * Create a new announcement (admin only)
 */
const createAnnouncementHandler = async (req, res) => {
  try {
    const createdBy = req.user ? req.user.id : "system";
    const announcement = await createAnnouncement(req.body, createdBy);
    return sendSuccess(res, 201, "Announcement created successfully", announcement);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to create announcement");
  }
};

module.exports = {
  getAllAnnouncements: getAllAnnouncementsHandler,
  getAnnouncementById: getAnnouncementByIdHandler,
  createAnnouncement: createAnnouncementHandler,
};
