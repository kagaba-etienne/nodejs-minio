const express = require("express");
const router = express.Router();
const multer = require("multer");

//import multer storage
const upload = require("../multer");

// import middleware
const { authenticateUser, authenticateAdmin } = require("../middlewares/auth");

// Import the file controllers
const fileController = require("../controllers/fileController");
const uploadFile = require("../controllers/uploadController");
const downloadFile = require("../controllers/downloadController");
const deleteFile = require("../controllers/deleteController");

// Define the CRUD endpoints for file objects
router.post(
  "/uploads",
  authenticateUser,
  (req, res, next) => {
    upload.array("upload")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            status: 400,
            message: `File too large, each single file should not be greater than ${20} MBs`,
          });
        }
      } else if (err) {
        return res.status(500).json({
          status: 500,
          message: "Internal server error 1",
          error: err,
          error_message: err.message,
        });
      }
      next();
    });
  },
  uploadFile,
);
router.get("/download", downloadFile);
router.get("/uploads/:id", authenticateUser, fileController.getFileById);
router.delete("/uploads/:id", authenticateUser, deleteFile);
router.get("/uploads", authenticateAdmin, fileController.getAllFiles);

module.exports = router;
