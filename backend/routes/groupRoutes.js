const express = require("express");
const router = express.Router();

const {
  getAllGroups,
  createGroup,
  getGroupById,
} = require("../controllers/groupController");
const { protect } = require("../middleware/authMiddleware");
const { validateFields } = require("../middleware/validationMiddleware");

// GET /api/groups - public
router.get("/", getAllGroups);

// POST /api/groups - protected
router.post("/", protect, validateFields(["name"]), createGroup);

// GET /api/groups/:id - public
router.get("/:id", getGroupById);

module.exports = router;
