const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger/logger");
const { body, validationResult } = require("express-validator");

const Register = async (req, res) => {
  const { authMethod, username, email, password, googleid } = req.body;

  try {
    if (authMethod === "local") {
      // Local Registration
      const errors = validationResult(req);

      //check for error after validating the input.
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      // Check if the email is already in use
      const existingUser = await User.findOne({ email }).exec();

      if (existingUser) {
        if (existingUser.googleid === "google") {
          return res
            .status(409)
            .json({ message: "This Email address uses Google sign in" });
        } else {
          return res.status(409).json({ error: "Email already in use" });
        }
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();

      if (savedUser) {
        // generate a jwt token upon successful local registration
        const payload = {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          role: savedUser.role,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });
        logger.info("Successfully created user");

        // Set the JWT as an HTTP-only cookie
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // For secure cookies in production
          sameSite: "strict", // To prevent CSRF
        });

        res.status(201).json({
          success: true,
          message: "Account Created",
          token: `Bearer ${token}`,
        });
      } else {
        return res.status(500).send({
          success: false,
          message: "Error occurred",
        });
      }
    } else {
      res.status(400).json({ error: "Invalid authentication method" });
    }
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const Login = async (req, res) => {
  // Validate request parameters
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: errors.array(),
    });
  }
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username }).exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Create a JWT payload
      const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      // Sign the JWT with a secret key stored in environment variables
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "1h", // Expiry time in seconds or a string with a unit
      });

      // Set the JWT as an HTTP-only cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // For secure cookies in production
        sameSite: "strict", // To prevent CSRF
      });

      return res.status(200).json({
        success: true,
        message: "Authenticated!",
        token: "Bearer " + token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password incorrect",
      });
    }
  } catch (error) {
    // Handle errors
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const handleGoogleAuthResult = async (req, res) => {
  // Successful Google OAuth login

  try {
    // Check if the user wiht the Google profile's ID in th database
    const existingUser = await User.findOne({ googleid: req.user._id }).exec();

    if (existingUser) {
      // User already exists, so we log them in and generate a JWT token

      // Create payload for signing the JWT
      const payload = {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
      res
        .cookie("jwt", token, {
          // Set the JWT as an HTTP-only cookie
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // For secure cookies in production
          sameSite: "strict", // To prevent CSRF
        })

        .status(201)
        .json({
          success: true,
          message: "Account Created",
          token: `Bearer ${token}`,
        });
    } else {
      // No user with this Google ID found, create one

      const newUser = new User({
        authMethod: "google",
        name: req.user.displayName,
        email: req.user.email[0].value,
        profilePicURL: req.user.photos[0] ? req.user.photos[0].value : "",
        googleId: req.user._id,
      });

      // save the new user to the database.
      const savedUser = await newUser.save();

      if (savedUser) {
        // Save was successful, so we log them in and generate a JWT token

        const payload = {
          id: savedUser._id,
          username: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });

        // Set the JWT as an HTTP-only cookie
        res.cookie("jwt", token, {
          // Set the JWT as an HTTP-only cookie
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // For secure cookies in production
          sameSite: "strict", // To prevent CSRF
        });
        return res.status(201).json({
          success: true,
          message: "Account Created",
          token: `Bearer ${token}`,
        });
      } else {
        logger.error(
          `[AUTHENTICATION ERROR]: Failed to register/login user from Google OAuth`
        );
        console.log("Error saving user");
        return res.status(500).json({
          success: false,
          error: "Server Error",
        });
      }
    }
  } catch (error) {
    logger.error(`[GOOGLE OAUTHENTICATION ERROR]: ${error}`);
    return res.status(500).json({
      success: false,
      error: "Server error during Google OAuth authentication",
    });
  }
};

module.exports = {
  Register,
  Login,
  handleGoogleAuthResult,
};
