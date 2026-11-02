const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  createProduct,
  getProductById,
} = require("../controllers/marketplaceController");
const { protect } = require("../middleware/authMiddleware");
const { validateFields } = require("../middleware/validationMiddleware");

// GET /api/marketplace - public
router.get("/", getAllProducts);

// POST /api/marketplace - protected
router.post("/", protect, validateFields(["name", "price"]), createProduct);

// GET /api/marketplace/:id - public
router.get("/:id", getProductById);

module.exports = router;
