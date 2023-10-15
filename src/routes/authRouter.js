const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validate } = require("../controllers/authController");

router.post("/login", validate("login"), authController.login);

module.exports = router;
