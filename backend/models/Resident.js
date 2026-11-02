// Resident model placeholder
// A Resident extends a User with address and property details

let residents = [];

const ResidentModel = {
  findAll: () => residents,
  findById: (id) => residents.find((r) => r.id === id),
  create: (data) => {
    const newResident = { id: `resident_${Date.now()}`, ...data };
    residents.push(newResident);
    return newResident;
  },
};

module.exports = ResidentModel;
