// This file defines validation middlewares for user registration, login, and Google authentication.
const { body } = require("express-validator");
const User = require("../../models/User");

//Define the validation middleware using the validationRule
const registerValidationMiddleware = [
  //sanitizing user input to match expected form.
  body("username")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Username is required."),
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 5 })
    .trim()
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .custom(async (value, { req }) => {
      // Check if the email is already in use by querying the database
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error("E-mail already in use.");
        }
      } catch (err) {
        // Handle database query errors
        throw new Error("Database error");
      }
    }),
];

// Middleware for user login validation
const loginValidationMiddleware = [
  body("username").isLength({ min: 1 }).isString().trim().escape(),
  body("password").isLength({ min: 1 }).isString().trim(),
];

// Middleware for Google authentication validation
const googelValidationMiddleware = [
  body("displayName").isString().trim().escape(),
  body("email").isEmail().normalizeEmail(),
  body("photoURL").isURL(),
  body("googleId").isString().trim(),
];

module.exports = {
  registerValidationMiddleware,
  loginValidationMiddleware,
  googelValidationMiddleware,
};
