function checkUserRole(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}

module.exports = checkUserRole;