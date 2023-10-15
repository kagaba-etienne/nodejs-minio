const minioClient = require("../minio/minio-connect");
const filename = require("../utils/filename");
const dotenv = require("dotenv").config();
const File = require("../models/files");

// Constants
const BUCKET_NAME = process.env.BUCKET_NAME;

const uploadFile = async (req, res) => {
  let files = [];
  await Promise.all(
    req.files.map((file) => {
      const name = filename(file.originalname);
      const path = `${req.userData.customDir}/${name}`;
      return new Promise((resolve, reject) => {
        minioClient.putObject(
          BUCKET_NAME,
          `${req.userData.customDir}/${name}`,
          file.buffer,
          async function (error, etag) {
            if (error) {
              return res.status(400).json(error);
            } else {
              const uFile = new File({
                name,
                path,
                size: file.size,
                user: req.userData.userId,
                etag: etag.etag,
                type: file.mimetype,
              });
              const newFile = await uFile.save();
              files.push(newFile);
              resolve(newFile);
            }
          },
        );
      });
    }),
  );
  res.status(201).json(files);
};

module.exports = uploadFile;
