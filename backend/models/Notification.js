// Notification model placeholder

let notifications = [];

const NotificationModel = {
  findAll: () => notifications,
  findByUserId: (userId) => notifications.filter((n) => n.userId === userId),
  create: (data) => {
    const newNotification = {
      id: `notif_${Date.now()}`,
      read: false,
      createdAt: new Date(),
      ...data,
    };
    notifications.push(newNotification);
    return newNotification;
  },
};

module.exports = NotificationModel;
