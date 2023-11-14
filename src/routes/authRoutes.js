const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

const { body, validationResult } = require("express-validator");
const {
  registerValidationMiddleware,
  loginValidationMiddleware,
  googelValidationMiddleware,
} = require("./middlewares/authValidationMiddleware");
const {
  Register,
  Login,
  handleGoogleAuthResult,
} = require("../controllers/authController");

//login route
router.get("/login", (req, res) => {
  res.json({message: "Login page"});
});

// Route for initiating Google OAuth login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route for handling the result of Google OAuth login
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googelValidationMiddleware,
  handleGoogleAuthResult, (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

//Register a route for user registration with the validation middleware
router.post("/local-register", registerValidationMiddleware, Register);

// Login Route and generate a JWT
router.post("/login", loginValidationMiddleware, Login);

module.exports = router;
