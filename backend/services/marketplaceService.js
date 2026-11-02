// Marketplace Service - business logic for the neighbourhood marketplace

const ProductModel = require("../models/Product");

/**
 * Retrieve all marketplace products.
 * @returns {Array} list of all products
 */
const getAllProducts = async () => {
  return await ProductModel.findAll();
};

/**
 * Retrieve a single product by id.
 * @param {string} id
 * @returns {Object} product
 * @throws {Error} 404 if not found
 */
const getProductById = async (id) => {
  const product = await ProductModel.findById(id);
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  return product;
};

/**
 * List a new product on the marketplace.
 * @param {Object} data - { name, description, price }
 * @param {string} sellerId - id of the user listing the product
 * @returns {Object} newly created product
 * @throws {Error} 400 if required fields are missing or price is invalid
 */
const createProduct = async ({ name, description, price }, sellerId) => {
  if (!name || !description || price === undefined || price === null) {
    const err = new Error("Name, description, and price are required");
    err.statusCode = 400;
    throw err;
  }

  const numericPrice = Number(price);
  if (isNaN(numericPrice) || numericPrice < 0) {
    const err = new Error("Price must be a non-negative number");
    err.statusCode = 400;
    throw err;
  }

  return await ProductModel.create({
    name,
    description,
    price: numericPrice,
    sellerId,
  });
};

module.exports = { getAllProducts, getProductById, createProduct };
