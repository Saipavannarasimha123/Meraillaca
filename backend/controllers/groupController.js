// Group Controller - thin HTTP adapter for community group operations

const {
  getAllGroups,
  getGroupById,
  createGroup,
  joinGroup,
  leaveGroup,
} = require("../services/groupService");
const { sendSuccess, sendError } = require("../utils/helpers");

/**
 * GET /api/groups
 * Get all groups (public)
 */
const getAllGroupsHandler = async (req, res) => {
  try {
    const groups = await getAllGroups();
    return sendSuccess(res, 200, "Groups fetched successfully", groups);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch groups");
  }
};

/**
 * GET /api/groups/:id
 * Get a single group by ID (public)
 */
const getGroupByIdHandler = async (req, res) => {
  try {
    const group = await getGroupById(req.params.id);
    return sendSuccess(res, 200, "Group fetched successfully", group);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch group");
  }
};

/**
 * POST /api/groups
 * Create a new group (protected)
 */
const createGroupHandler = async (req, res) => {
  try {
    const group = await createGroup(req.body, req.user.id);
    return sendSuccess(res, 201, "Group created successfully", group);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to create group");
  }
};

/**
 * POST /api/groups/:id/join
 * Join a group (protected)
 */
const joinGroupHandler = async (req, res) => {
  try {
    const group = await joinGroup(req.params.id, req.user.id);
    return sendSuccess(res, 200, "Joined group successfully", group);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to join group");
  }
};

/**
 * POST /api/groups/:id/leave
 * Leave a group (protected)
 */
const leaveGroupHandler = async (req, res) => {
  try {
    const group = await leaveGroup(req.params.id, req.user.id);
    return sendSuccess(res, 200, "Left group successfully", group);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to leave group");
  }
};

module.exports = {
  getAllGroups: getAllGroupsHandler,
  getGroupById: getGroupByIdHandler,
  createGroup: createGroupHandler,
  joinGroup: joinGroupHandler,
  leaveGroup: leaveGroupHandler,
};
