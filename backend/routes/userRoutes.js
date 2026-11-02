const express = require("express");
const router = express.Router();

const { getProfile, updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/users/profile - protected route
router.get("/profile", protect, getProfile);

// PUT /api/users/profile - protected route
router.put("/profile", protect, updateProfile);

module.exports = router;
