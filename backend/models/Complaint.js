// Complaint model placeholder

let complaints = [];

const ComplaintModel = {
  findAll: () => complaints,
  findById: (id) => complaints.find((c) => c.id === id),
  create: (data) => {
    const newComplaint = {
      id: `complaint_${Date.now()}`,
      status: "open",
      createdAt: new Date(),
      ...data,
    };
    complaints.push(newComplaint);
    return newComplaint;
  },
};

module.exports = ComplaintModel;
