const express = require("express");
const router = express.Router();

const {
  getAllComplaints,
  createComplaint,
  getComplaintById,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");
const { validateFields } = require("../middleware/validationMiddleware");

// GET /api/complaints - protected (only logged-in users)
router.get("/", protect, getAllComplaints);

// POST /api/complaints - protected
router.post("/", protect, validateFields(["title", "description"]), createComplaint);

// GET /api/complaints/:id - protected
router.get("/:id", protect, getComplaintById);

module.exports = router;
