const express = require("express");
const router = express.Router();

const {
  getAllEmergencies,
  createEmergency,
  getEmergencyById,
} = require("../controllers/emergencyController");
const { protect } = require("../middleware/authMiddleware");
const { validateFields } = require("../middleware/validationMiddleware");

// GET /api/emergency - protected
router.get("/", protect, getAllEmergencies);

// POST /api/emergency - protected
router.post("/", protect, validateFields(["type", "description"]), createEmergency);

// GET /api/emergency/:id - protected
router.get("/:id", protect, getEmergencyById);

module.exports = router;
