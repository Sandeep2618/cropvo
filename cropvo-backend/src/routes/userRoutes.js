// ============================================
// User Routes
// ============================================
// GET /users - Get all users
// GET /user/profile - Get current user profile (protected)

const express = require('express');
const { getAllUsers, getUserProfile } = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

/**
 * GET /users
 * Get all users (public)
 */
router.get('/users', getAllUsers);

/**
 * GET /user/profile
 * Get current user profile (protected - requires JWT)
 */
router.get('/user/profile', verifyToken, getUserProfile);

module.exports = router;
