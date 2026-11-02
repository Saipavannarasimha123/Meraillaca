// Service model placeholder

let services = [];

const ServiceModel = {
  findAll: () => services,
  findById: (id) => services.find((s) => s.id === id),
  create: (data) => {
    const newService = { id: `service_${Date.now()}`, ...data };
    services.push(newService);
    return newService;
  },
};

module.exports = ServiceModel;
