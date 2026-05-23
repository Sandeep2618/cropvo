// ============================================
// User Controller
// ============================================
// Handles user-related operations

const User = require('../models/User');

/**
 * Get all users
 * GET /users
 * Note: Password field is excluded for security
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users',
    });
  }
};

/**
 * Get current user profile (requires authentication)
 * GET /user/profile
 */
const getUserProfile = async (req, res) => {
  try {
    // req.userId is set by auth middleware
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch profile',
    });
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
};
