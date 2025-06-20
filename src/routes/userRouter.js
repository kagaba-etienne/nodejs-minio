const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const { validate } = userController;

router.get("/", userController.getUsers);

router.get("/:id", userController.getUserById);

router.post("/", validate("createUser"), userController.createUser);

router.put("/:id", validate("updateUser"), userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
