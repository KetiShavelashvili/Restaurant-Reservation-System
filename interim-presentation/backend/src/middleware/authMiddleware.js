const { sessions } = require('../models/userModel');

// Protect routes - check if user is authenticated
exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please login'
    });
  }

  const session = sessions[token];
  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session, please login again'
    });
  }

  // Attach user info to request
  req.user = session;
  next();
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    next();
  };
};