// Booking model placeholder (service bookings)

let bookings = [];

const BookingModel = {
  findAll: () => bookings,
  findById: (id) => bookings.find((b) => b.id === id),
  create: (data) => {
    const newBooking = {
      id: `booking_${Date.now()}`,
      status: "pending",
      createdAt: new Date(),
      ...data,
    };
    bookings.push(newBooking);
    return newBooking;
  },
};

module.exports = BookingModel;
