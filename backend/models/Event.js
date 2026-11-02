// Event model placeholder

let events = [];

const EventModel = {
  findAll: () => events,
  findById: (id) => events.find((e) => e.id === id),
  create: (data) => {
    const newEvent = { id: `event_${Date.now()}`, createdAt: new Date(), ...data };
    events.push(newEvent);
    return newEvent;
  },
};

module.exports = EventModel;
