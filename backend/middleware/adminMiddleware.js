// Admin-only access middleware
// Use this AFTER the protect middleware to restrict routes to admins

const { ROLES } = require("../utils/constants");

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === ROLES.ADMIN) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
};

module.exports = { adminOnly };
