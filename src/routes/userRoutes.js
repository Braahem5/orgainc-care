const express = require("express");
const passport = require("passport");
const router = express.Router();
const userController = require('../controllers/userController');
const checkUserRole = require("../utils/roleBaseAuth/checkUserRole");

router.get("/users", checkUserRole("admin"), userController.getUsers);
router.get("/users/:id", userController.getUser);
router.put("/users/:id", userController.updateUser);

module.exports = router;
 