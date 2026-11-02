const express = require("express");
const router = express.Router();

const {
  getAllBusinesses,
  createBusiness,
  getBusinessById,
} = require("../controllers/businessController");
const { protect } = require("../middleware/authMiddleware");
const { validateFields } = require("../middleware/validationMiddleware");

// GET /api/businesses - public
router.get("/", getAllBusinesses);

// POST /api/businesses - protected
router.post("/", protect, validateFields(["name", "category"]), createBusiness);

// GET /api/businesses/:id - public
router.get("/:id", getBusinessById);

module.exports = router;
