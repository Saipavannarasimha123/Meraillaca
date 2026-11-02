// Marketplace Controller - thin HTTP adapter for marketplace product operations

const {
  getAllProducts,
  getProductById,
  createProduct,
} = require("../services/marketplaceService");
const { sendSuccess, sendError } = require("../utils/helpers");

/**
 * GET /api/marketplace
 * Get all marketplace products (public)
 */
const getAllProductsHandler = async (req, res) => {
  try {
    const products = await getAllProducts();
    return sendSuccess(res, 200, "Products fetched successfully", products);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch products");
  }
};

/**
 * GET /api/marketplace/:id
 * Get a single product by ID (public)
 */
const getProductByIdHandler = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    return sendSuccess(res, 200, "Product fetched successfully", product);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to fetch product");
  }
};

/**
 * POST /api/marketplace
 * List a new product (protected)
 */
const createProductHandler = async (req, res) => {
  try {
    const product = await createProduct(req.body, req.user.id);
    return sendSuccess(res, 201, "Product listed successfully", product);
  } catch (err) {
    return sendError(res, err.statusCode || 500, err.message || "Failed to list product");
  }
};

module.exports = {
  getAllProducts: getAllProductsHandler,
  getProductById: getProductByIdHandler,
  createProduct: createProductHandler,
};
