// utils/seedAdmin.js
// Development-only utility: creates a single admin user in the in-memory store
// on server startup if one does not already exist.
//
// SECURITY: This file is guarded by NODE_ENV checks. It must NEVER be used in
// production and does NOT expose any public API endpoint.
//
// Dev admin credentials (change these before starting the server):
//   Email   : YOUR_EMAIL_HERE
//   Password: YOUR_PASSWORD_HERE

const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");

// ----- Change these to your preferred dev admin credentials -----
const ADMIN_NAME = "Super Admin";
const ADMIN_EMAIL = "SaiPavan@Email";
const ADMIN_PASSWORD = "Saipavan@1234";
// ----------------------------------------------------------------

const seedAdmin = async () => {
  // Hard guard: never run in production
  if (process.env.NODE_ENV === "production") return;

  try {
    // Check if an admin user already exists
    const existing = await UserModel.findByEmail(ADMIN_EMAIL);
    if (existing) {
      console.log("[seedAdmin] Admin user already exists - skipping seed.");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = await UserModel.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    console.log("[seedAdmin] Dev admin created - email: " + admin.email);
  } catch (err) {
    console.error("[seedAdmin] Failed to seed admin user:", err.message);
  }
};

module.exports = { seedAdmin };
