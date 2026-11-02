// Event Service - business logic for community events

const EventModel = require("../models/Event");

/**
 * Retrieve all events.
 * @returns {Array} list of all events
 */
const getAllEvents = async () => {
  return await EventModel.findAll();
};

/**
 * Retrieve a single event by id.
 * @param {string} id
 * @returns {Object} event
 * @throws {Error} 404 if not found
 */
const getEventById = async (id) => {
  const event = await EventModel.findById(id);
  if (!event) {
    const err = new Error("Event not found");
    err.statusCode = 404;
    throw err;
  }
  return event;
};

/**
 * Create a new community event.
 * @param {Object} data - { title, description, date, location }
 * @param {string} organizer - id of the user creating the event
 * @returns {Object} newly created event
 * @throws {Error} 400 if required fields are missing or date is invalid
 */
const createEvent = async ({ title, description, date, location }, organizer) => {
  if (!title || !description || !date || !location) {
    const err = new Error("Title, description, date, and location are required");
    err.statusCode = 400;
    throw err;
  }

  // Validate that date is a parseable date string
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    const err = new Error("Invalid date format");
    err.statusCode = 400;
    throw err;
  }

  return await EventModel.create({
    title,
    description,
    date: parsedDate,
    location,
    organizer,
  });
};

module.exports = { getAllEvents, getEventById, createEvent };
