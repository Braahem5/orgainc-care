// Passport Config
const passport = require("passport");
const logger = require("../utils/logger/logger")
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const opt = {};
opt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opt.secretOrKey = process.env.SECRET_KEY;

passport.use(
  new JwtStrategy(opt, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false, { message: "User not found" });
      }
    } catch (err) {
      logger.erroror("Error in JWT strategy:", err);
      return done(err, false);
    }
  })
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        // check if a user with the Google profile's ID already exists
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          // Return the JWT token in the response
          return cb(null, existingUser);
        } else{
          
          return cb(null, profile);
        }

      } catch (error) {
        logger.error(`Error in google strategy, ${error}`);
        cb(error, false);
      }
    }
  )
);

module.exports = passport;
