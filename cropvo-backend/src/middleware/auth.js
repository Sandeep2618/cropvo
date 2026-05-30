// ============================================
// Authentication Middleware
// ============================================
// Verifies JWT token and protects routes

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Verify JWT token middleware
 * Adds userId and role to req object if token is valid
 * Required for protected routes
 */
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again',
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again',
    });
  }
};

const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.userRole || !allowedRoles.includes(req.userRole)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: insufficient permissions',
    });
  }
  next();
};

module.exports = {
  verifyToken,
  requireRole,
};
