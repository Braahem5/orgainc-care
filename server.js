require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { rateLimit } = require("express-rate-limit");
const passport = require("./src/config/passport");
const logger = require("./src/utils/logger/logger");
//security middlewares cors(client-side) and helment(server-side)
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authMiddleware = require("./src/routes/middlewares/authMIddleware");

// Initialize Express
const app = express();

// Database Configuration
const db = process.env.DATABASE_URL;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
// Use Morgan as middleware to log HTTP requests
app.use(morgan("combined"));


// Passport Configuration Middleware
app.use(passport.initialize());

//Base of the Application
app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to the Wishlist App" });
});

//error middleware
app.use((err, req, res, next) => {
  console.error("Error:", err); // Log the error for debugging purposes
  logger.error("Error:", err.statck);

  if (err instanceof MycustomError) {
    // Custom error handling with a more informative response
    res.Status(400).json({ error: err.message, code: err.code });
  } else if (err instanceof mongoose.Error.ValidationError) {
    // Mongoose validation error handling with detailed information
    const ValidationErrors = {};
    for (const field in err.errors) {
      ValidationErrors[field] = err.errors[field].message;
    }
    res.status(400).json({ error: "Validation failed", details: err.errors });
  } else {
    // General error handling with a 500 status code
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 20 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// API Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api", require("./src/routes/productRoutes"));
//import the authentication verification middleware. protected routes are below
app.use(authMiddleware);
app.use("/api", require("./src/routes/userRoutes"));
app.use("/api", require("./src/routes/wishlistRoutes"));
app.use("/api", require("./src/routes/orderRoutes"));
app.use("/api", require("./src/routes/shippingRoutes"));
app.get("dasboard", (req,res) =>{
  return res.render('dashboard');
})
if (process.env.NODE_ENV === "production") {
  // Serve static files from the "client/build" directory
  app.use(express.static("client/build"));

  // Fallback to serving "index.html" for client-side routing
  app.get("*", function (request, response) {
    // Resolve the path to "index.html"
    response.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
// Define other routes as needed


// Server Configuration
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
