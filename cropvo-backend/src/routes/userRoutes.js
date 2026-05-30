// ============================================
// User Routes
// ============================================
// GET /users - Get all users
// GET /user/profile - Get current user profile (protected)

const express = require('express');
const {
  getAllUsers,
  getUserProfile,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /users
 * Get all users (admin only)
 */
router.get('/users', verifyToken, requireRole('admin'), getAllUsers);

/**
 * GET /user/profile
 * Get current user profile (protected - requires JWT)
 */
router.get('/user/profile', verifyToken, getUserProfile);

/**
 * PATCH /users/:id
 * Update user role or details (admin only)
 */
router.patch('/users/:id', verifyToken, requireRole('admin'), updateUser);

/**
 * DELETE /users/:id
 * Delete user (admin only)
 */
router.delete('/users/:id', verifyToken, requireRole('admin'), deleteUser);

module.exports = router;
