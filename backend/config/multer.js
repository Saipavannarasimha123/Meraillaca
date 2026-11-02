// config/multer.js
// Multer configuration for handling file uploads.
// Uploaded files are saved to the backend/uploads folder with unique names.

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- Storage Configuration ---
const storage = multer.diskStorage({
  // Set the destination folder where uploaded files will be saved
  destination: (_req, _file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");

    // Create the uploads folder if it does not already exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  // Generate a unique file name to avoid overwriting existing files
  filename: (_req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// --- File Type Filter ---
// Only allow common image formats
const fileFilter = (_req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;

  const isExtensionValid = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isMimeTypeValid = allowedExtensions.test(file.mimetype);

  if (isExtensionValid && isMimeTypeValid) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed."), false);
  }
};

// --- Multer Instance ---
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB maximum file size
  },
});

module.exports = upload;
