// ============================================
// Authentication Routes
// ============================================
// POST /auth/signup - Register new user
// POST /auth/login - Login user

const express = require('express');
const { signup, login } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validation');

const router = express.Router();

/**
 * POST /auth/signup
 * Register new user
 * Body: { name, email, password, confirmPassword }
 */
router.post('/signup', validateSignup, signup);

/**
 * POST /auth/login
 * Login user
 * Body: { email, password }
 */
router.post('/login', validateLogin, login);

module.exports = router;
