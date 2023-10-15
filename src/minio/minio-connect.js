require("dotenv").config();

const Minio = require("minio");
const minioClient = new Minio.Client({
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  endPoint: process.env.HOST,
  port: parseInt(process.env.PORT ?? 9000),
  useSSL: false,
});

module.exports = minioClient;
