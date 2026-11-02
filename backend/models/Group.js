// Group model placeholder (community groups / WhatsApp-style groups)

let groups = [];

const GroupModel = {
  findAll: () => groups,
  findById: (id) => groups.find((g) => g.id === id),
  create: (data) => {
    const newGroup = { id: `group_${Date.now()}`, members: [], createdAt: new Date(), ...data };
    groups.push(newGroup);
    return newGroup;
  },
};

module.exports = GroupModel;
