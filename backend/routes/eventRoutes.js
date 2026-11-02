const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  createEvent,
  getEventById,
} = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");
const { validateFields } = require("../middleware/validationMiddleware");

// GET /api/events - public
router.get("/", getAllEvents);

// POST /api/events - protected
router.post("/", protect, validateFields(["title", "date"]), createEvent);

// GET /api/events/:id - public
router.get("/:id", getEventById);

module.exports = router;
