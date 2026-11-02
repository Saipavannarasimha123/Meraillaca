// Auth Service - business logic for registration and login

const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const UserModel = require("../models/User");

/**
 * Register a new resident user.
 * @param {Object} data - { name, email, password }
 * @returns {{ user: Object, token: string }}
 * @throws {Error} with statusCode 400 if validation fails or email already taken
 */
const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    const err = new Error("Name, email, and password are required");
    err.statusCode = 400;
    throw err;
  }

  if (password.length < 6) {
    const err = new Error("Password must be at least 6 characters");
    err.statusCode = 400;
    throw err;
  }

  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    const err = new Error("User with this email already exists");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    role: "resident",
  });

  const token = generateToken(newUser.id, newUser.role);

  return {
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    token,
  };
};

/**
 * Log in a user with email and password.
 * @param {Object} data - { email, password }
 * @returns {{ user: Object, token: string }}
 * @throws {Error} with statusCode 400/404/401 on failure
 */
const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.statusCode = 400;
    throw err;
  }

  const user = await UserModel.findByEmail(email);
  if (!user) {
    const err = new Error("No user found with this email");
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Incorrect password");
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user.id, user.role);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

module.exports = { registerUser, loginUser };
