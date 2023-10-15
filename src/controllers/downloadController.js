const minioClient = require("../minio/minio-connect");
const filename = require("../utils/filename");
const dotenv = require("dotenv").config();

// Constants
const BUCKET_NAME = process.env.BUCKET_NAME;

const downloadFile = (request, response) => {
  minioClient.getObject(
    BUCKET_NAME,
    request.query.filename,
    function (error, stream) {
      if (error) {
        return response.status(500).send(error);
      }
      stream.pipe(response);
    },
  );
};

module.exports = downloadFile;
