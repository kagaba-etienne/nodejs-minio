const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "login": {
      return [
        body("email").isEmail().withMessage("Invalid email address"),
        body("password").notEmpty().withMessage("Password is required"),
      ];
    }
  }
};

exports.login = async (req, res) => {
  try {
    // Validate input data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errs = new Error("Invalid inputs");
      errs.errors = errors.array();
      throw errs;
    }

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!errors.isEmpty()) {
      const errs = new Error("Invalid email or password");
      throw errs;
    }

    // Compare passwords
    console.log(req.body.password, user.password);
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      const errs = new Error("Invalid email or password");
      throw errs;
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, customDir: user.customDir },
      process.env.JWT_SECRET,
    );

    // Send token to client
    res.json({ message: "Successful Login!", token });
  } catch (error) {
    if (
      error.message.includes("Invalid inputs") ||
      error.message.includes("Invalid email or password")
    ) {
      res
        .status(400)
        .json({ message: error.message, errors: error.errors ?? [] });
    } else {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
};
