// Business model placeholder

let businesses = [];

const BusinessModel = {
  findAll: () => businesses,
  findById: (id) => businesses.find((b) => b.id === id),
  create: (data) => {
    const newBusiness = { id: `business_${Date.now()}`, ...data };
    businesses.push(newBusiness);
    return newBusiness;
  },
};

module.exports = BusinessModel;
