const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const minioClient = require("./minio/minio-connect");
const mongoose = require("mongoose");

// Constants
const BUCKET_NAME = process.env.BUCKET_NAME;
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT ?? 5000;

// Routers + Middlewares
const fileRouter = require("./routes/fileRouter");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const { authenticateUser, authenticateAdmin } = require("./middlewares/auth");

const app = express();
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", fileRouter);
app.use("/users", authenticateAdmin, userRouter);
app.use("/auth", authRouter);

minioClient.bucketExists(BUCKET_NAME, function (error) {
  if (error) {
    return console.log(error);
  }
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
      var server = app.listen(PORT, function () {
        console.log("Listening on port %s...", server.address().port);
      });
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB", error.message);
    });
});

module.exports = app;
