const express = require("express");
const router = express.Router();

const { getAllUsers, getDashboard } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// All admin routes require authentication AND admin role
// GET /api/admin/dashboard
router.get("/dashboard", protect, adminOnly, getDashboard);

// GET /api/admin/users
router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;
