// Authentication middleware
// Protects routes by verifying the JWT token in the Authorization header

const { verifyToken } = require("../config/jwt");
const UserModel = require("../models/User");

const protect = async (req, res, next) => {
  // Get token from Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token signature and expiry
    const decoded = verifyToken(token);

    // Look up the live user record so req.user.role always reflects the DB,
    // not an outdated role that may have been baked into an old token
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. User no longer exists.",
      });
    }

    // Attach only what downstream middleware/controllers need — never expose password
    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Token is invalid or expired.",
    });
  }
};

module.exports = { protect };
