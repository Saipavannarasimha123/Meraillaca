// Event Controller - thin HTTP adapter for community event operations

const { getAllEvents, getEventById, createEvent } = require("../services/eventService");
const { sendSuccess, sendError } = require("../utils/helpers");

/**
 * GET /api/events
 * Get all events (public)
 */
const getAllEventsHandler = async (req, res) => {
  try {
    const events = await getAllEvents();
    return sendSuccess(res, 200, "Events fetched successfully", events);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch events");
  }
};

/**
 * GET /api/events/:id
 * Get a single event by ID (public)
 */
const getEventByIdHandler = async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    return sendSuccess(res, 200, "Event fetched successfully", event);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch event");
  }
};

/**
 * POST /api/events
 * Create a new event (protected)
 */
const createEventHandler = async (req, res) => {
  try {
    const event = await createEvent(req.body, req.user.id);
    return sendSuccess(res, 201, "Event created successfully", event);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to create event");
  }
};

module.exports = {
  getAllEvents: getAllEventsHandler,
  getEventById: getEventByIdHandler,
  createEvent: createEventHandler,
};
