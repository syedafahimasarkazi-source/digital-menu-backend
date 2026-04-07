const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "menu-items",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});




const path = require("path");

const fileFilter = (req, file, cb) => {
  console.log("MIME:", file.mimetype);
  console.log("EXT:", path.extname(file.originalname));

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/octet-stream", // fallback for Postman
  ];

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP images are allowed"), false);
  }
};

// Size limit (e.g., 2MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = upload;