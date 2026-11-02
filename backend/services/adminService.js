// Admin Service - business logic for admin dashboard and user management

const UserModel = require("../models/User");
const AnnouncementModel = require("../models/Announcement");
const ComplaintModel = require("../models/Complaint");
const EventModel = require("../models/Event");
const { sanitizeUser } = require("./userService");

/**
 * Retrieve all registered users, with passwords stripped.
 * @returns {Array} list of safe user objects
 */
const getAllUsers = async () => {
  const users = await UserModel.findAll();
  return users.map(sanitizeUser);
};

/**
 * Get aggregated dashboard statistics.
 * @returns {Object} dashboard stats
 */
const getDashboardStats = async () => {
  const [users, announcements, complaints, events] = await Promise.all([
    UserModel.findAll(),
    AnnouncementModel.findAll(),
    ComplaintModel.findAll(),
    EventModel.findAll(),
  ]);

  const openComplaints = complaints.filter((c) => c.status === "open").length;
  const resolvedComplaints = complaints.filter((c) => c.status === "resolved").length;

  return {
    totalUsers: users.length,
    totalAnnouncements: announcements.length,
    totalComplaints: complaints.length,
    openComplaints,
    resolvedComplaints,
    totalEvents: events.length,
    message: "Dashboard data fetched successfully",
  };
};

module.exports = { getAllUsers, getDashboardStats };
