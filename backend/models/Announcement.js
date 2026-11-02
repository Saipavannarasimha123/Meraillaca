// Announcement model placeholder

let announcements = [];

const AnnouncementModel = {
  findAll: () => announcements,
  findById: (id) => announcements.find((a) => a.id === id),
  create: (data) => {
    const newAnnouncement = { id: `ann_${Date.now()}`, createdAt: new Date(), ...data };
    announcements.push(newAnnouncement);
    return newAnnouncement;
  },
};

module.exports = AnnouncementModel;
