const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    try {
      // Check if user exists (important safety check)
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          message: "Not authorized, no user found",
        });
      }

      // Check role
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next();
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };
};

module.exports = roleMiddleware;