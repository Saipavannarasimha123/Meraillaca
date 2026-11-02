// Basic request validation middleware
// You can expand this with a library like express-validator or joi later

/**
 * Checks that required fields are present in req.body.
 * Usage: validateFields(["name", "email", "password"])
 */
const validateFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = { validateFields };
