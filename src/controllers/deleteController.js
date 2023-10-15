const minioClient = require("../minio/minio-connect");
const filename = require("../utils/filename");
const dotenv = require("dotenv").config();
const File = require("../models/files");

// Constants
const BUCKET_NAME = process.env.BUCKET_NAME;

const deleteObjects = async (files) => {
  console.log(`Deleting Objects in Bucket: ${BUCKET_NAME}`);
  await minioClient.removeObjects(BUCKET_NAME, files).catch((e) => {
    throw e;
  });
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (file == null) {
      throw new Error("File not found");
    }
    const match = req.userData.userId === file.user.toString();
    if (!match) {
      throw new Error("Unauthorized");
    }
    await deleteObjects([file.path]);
    await File.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "File deleted" });
  } catch (err) {
    console.log(err);
    if (
      err.message.includes("File not found") ||
      err.message.includes("Unauthorized")
    ) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = deleteFile;
