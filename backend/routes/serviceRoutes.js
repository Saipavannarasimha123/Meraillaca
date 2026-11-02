const express = require("express");
const router = express.Router();

const {
  getAllServices,
  createService,
  getServiceById,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");
const { validateFields } = require("../middleware/validationMiddleware");

// GET /api/services - public
router.get("/", getAllServices);

// POST /api/services - protected
router.post("/", protect, validateFields(["name", "category"]), createService);

// GET /api/services/:id - public
router.get("/:id", getServiceById);

module.exports = router;
