// Group Service - business logic for community groups

const GroupModel = require("../models/Group");

/**
 * Retrieve all groups.
 * @returns {Array} list of all groups
 */
const getAllGroups = async () => {
  return await GroupModel.findAll();
};

/**
 * Retrieve a single group by id.
 * @param {string} id
 * @returns {Object} group
 * @throws {Error} 404 if not found
 */
const getGroupById = async (id) => {
  const group = await GroupModel.findById(id);
  if (!group) {
    const err = new Error("Group not found");
    err.statusCode = 404;
    throw err;
  }
  return group;
};

/**
 * Create a new community group.
 * @param {Object} data - { name, description }
 * @param {string} createdBy - id of the user creating the group
 * @returns {Object} newly created group
 * @throws {Error} 400 if required fields are missing
 */
const createGroup = async ({ name, description }, createdBy) => {
  if (!name || !description) {
    const err = new Error("Name and description are required");
    err.statusCode = 400;
    throw err;
  }

  return await GroupModel.create({
    name,
    description,
    createdBy,
    members: [createdBy], // creator is automatically the first member
  });
};

/**
 * Add a member to a group.
 * @param {string} groupId
 * @param {string} userId - id of the user joining
 * @returns {Object} updated group
 * @throws {Error} 404 if group not found, 400 if already a member
 */
const joinGroup = async (groupId, userId) => {
  const group = await GroupModel.findById(groupId);
  if (!group) {
    const err = new Error("Group not found");
    err.statusCode = 404;
    throw err;
  }

  if (group.members && group.members.includes(userId)) {
    const err = new Error("You are already a member of this group");
    err.statusCode = 400;
    throw err;
  }

  group.members = group.members ? [...group.members, userId] : [userId];
  return group;
};

/**
 * Remove a member from a group.
 * @param {string} groupId
 * @param {string} userId - id of the user leaving
 * @returns {Object} updated group
 * @throws {Error} 404 if group not found, 400 if not a member
 */
const leaveGroup = async (groupId, userId) => {
  const group = await GroupModel.findById(groupId);
  if (!group) {
    const err = new Error("Group not found");
    err.statusCode = 404;
    throw err;
  }

  if (!group.members || !group.members.includes(userId)) {
    const err = new Error("You are not a member of this group");
    err.statusCode = 400;
    throw err;
  }

  group.members = group.members.filter((memberId) => memberId !== userId);
  return group;
};

module.exports = { getAllGroups, getGroupById, createGroup, joinGroup, leaveGroup };
