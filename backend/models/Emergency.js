// Emergency model placeholder (emergency alerts)

let emergencies = [];

const EmergencyModel = {
  findAll: () => emergencies,
  findById: (id) => emergencies.find((e) => e.id === id),
  create: (data) => {
    const newEmergency = { id: `emergency_${Date.now()}`, createdAt: new Date(), ...data };
    emergencies.push(newEmergency);
    return newEmergency;
  },
};

module.exports = EmergencyModel;
