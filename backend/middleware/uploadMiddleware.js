// Upload middleware using multer config
// Use uploadSingle or uploadMultiple in your routes

const upload = require("../config/multer");

// Upload a single file with a given field name
const uploadSingle = (fieldName) => upload.single(fieldName);

// Upload multiple files (max 5) with a given field name
const uploadMultiple = (fieldName, maxCount = 5) =>
  upload.array(fieldName, maxCount);

module.exports = { uploadSingle, uploadMultiple };
