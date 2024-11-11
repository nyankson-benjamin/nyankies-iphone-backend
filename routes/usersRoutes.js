const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.getUsers);
router.get("/:_id", usersController.getUserById);
router.put("/:_id", usersController.updateUser);
router.delete("/:_id", usersController.deleteUser);
router.put("/:_id/role", usersController.updateUserRole);


module.exports = router;