// src/middlewares/roleMiddleware.js

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    try {
      // ✅ Check if user exists
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, no user found",
        });
      }

      // ✅ Check role permission
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};

module.exports = { roleMiddleware };