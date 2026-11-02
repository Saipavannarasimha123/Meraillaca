// User model placeholder
// When you add MongoDB, replace this with a real Mongoose schema

// Placeholder in-memory store (for development/testing only)
let users = [];

const UserModel = {
  // Return all users
  findAll: async () => users,

  // Find a user by their ID
  findById: async (id) => users.find((u) => u.id === id),

  // Find a user by their email
  findByEmail: async (email) => users.find((u) => u.email === email),

  // Create a new user and add to the list
  create: async (data) => {
    const newUser = { id: `user_${Date.now()}`, ...data };
    users.push(newUser);
    return newUser;
  },

  // Update an existing user's fields by ID
  // Returns the updated user, or null if not found
  update: async (id, fields) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...fields };
    return users[index];
  },
};

module.exports = UserModel;
