const express = require("express");
const router = express.Router();

const {
  getAllAnnouncements,
  createAnnouncement,
  getAnnouncementById,
} = require("../controllers/announcementController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { validateFields } = require("../middleware/validationMiddleware");

// GET /api/announcements - public
router.get("/", getAllAnnouncements);

// POST /api/announcements - admin only
router.post("/", protect, adminOnly, validateFields(["title", "content"]), createAnnouncement);

// GET /api/announcements/:id - public
router.get("/:id", getAnnouncementById);

module.exports = router;
