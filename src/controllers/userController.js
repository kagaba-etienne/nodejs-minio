const User = require("../models/user");
const hash = require("../utils/hash");

const { body, validationResult } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "createUser": {
      return [
        body("username").notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Invalid email address"),
        body("customDir")
          .notEmpty()
          .withMessage("Custom directory is required"),
        body("password").notEmpty().withMessage("Password is required"),
        body("password", "Password must be at least 6 characters").isLength({
          min: 6,
        }),
        body("role", "Invalid role")
          .optional()
          .isIn(["admin", "user"])
          .default("user"),
      ];
    }
    case "updateUser": {
      return [
        body("username").notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Invalid email address"),
        body("password")
          .optional()
          .notEmpty()
          .withMessage("Password is required"),
        body("password", "Password must be at least 6 characters")
          .optional()
          .isLength({ min: 6 }),
      ];
    }
  }
};

// GET /users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("User not Found");
      throw error;
    }
    res.status(200).json(user);
  } catch (err) {
    if (err.message.includes("User not Found")) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

// POST /users
exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errs = new Error("Invalid inputs");
      errs.errors = errors.array();
      throw errs;
    }
    const user = new User({
      ...req.body,
      password: await hash(req.body.password),
    });
    const newUser = await user.save();
    res.status(200).json(newUser);
  } catch (err) {
    if (err.message.includes("Invalid inputs")) {
      res.status(400).json({ message: err.message, errors: err.errors ?? [] });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

// PUT /users/:id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("User not Found");
      throw error;
    }
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errs = new Error("Invalid inputs");
      errs.errors = errors.array();
      throw errs;
    }

    const update = req.body;
    //check if a user updated password
    if (update.hasOwnProperty("password")) {
      update.password = hash(update.password);
    }

    user = { ...user, ...update };

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.message.includes("User not Found")) {
      res.status(404).json({ message: err.message });
    } else if (err.message.includes("Invalid inputs")) {
      res.status(400).json({ message: err.message, errors: err.errors ?? [] });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("User not Found");
      throw error;
    }
    await user.remove();
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    if (err.message.includes("User not Found")) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};
