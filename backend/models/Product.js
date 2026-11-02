// Product model placeholder (for the marketplace)

let products = [];

const ProductModel = {
  findAll: () => products,
  findById: (id) => products.find((p) => p.id === id),
  create: (data) => {
    const newProduct = { id: `product_${Date.now()}`, createdAt: new Date(), ...data };
    products.push(newProduct);
    return newProduct;
  },
};

module.exports = ProductModel;
