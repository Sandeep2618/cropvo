// ============================================
// Input Validation Middleware
// ============================================
// Validates incoming request data

/**
 * Validate signup request
 * Required fields: name, email, password, confirmPassword
 */
const validateSignup = (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'All fields (name, email, password, confirmPassword) are required',
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match',
    });
  }

  if (role && !['patient', 'doctor', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role. Must be patient, doctor, or admin' });
  }

  next();
};

/**
 * Validate login request
 * Required fields: email, password
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
};
