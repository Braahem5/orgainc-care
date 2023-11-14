const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;


function authMiddleware(req, res, next) {
    if (!secretKey) {
      const errorMessage =
        "Internal server error. Please contact the administrator.";
    
      console.error("SECRET_KEY is missing. Cannot perform JWT verification.");
      return res.status(500).send({ error: errorMessage });
    }

  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res
        .status(401)
        .json({
          error: "You must provide a valid token in the authorization header",
        });
    }
    // Get the token from header
    const token = req.headers.authorization.split(" ")[1];
    // Verify that the token is valid and get user data
    const decodedToken = jwt.verify(token, secretKey);
    // If the token is valid, attach the user information to the request for future use
    req.user = decodedToken;
    // Call the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid Token or User not found!" });
  }
}

module.exports = authMiddleware;
