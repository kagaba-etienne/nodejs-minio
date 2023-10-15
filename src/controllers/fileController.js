// Import the File model
const File = require("../models/files");

// Get all files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a file by ID
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (file == null) {
      throw new Error("File not found");
    }
    res.status(200).json(file);
  } catch (err) {
    if (err.message.includes("File not found")) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};
