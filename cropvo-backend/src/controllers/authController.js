// ============================================
// Authentication Controller
// ============================================
// Handles user registration and login logic

const jwt = require('jsonwebtoken');
const {
  getModelByRole,
  getUserRole,
  findUserByEmail,
  extractRoleFields,
} = require('../utils/userModels');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '7d';

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in instead.',
      });
    }

    const normalizedRole = getUserRole(role);
    const UserModel = getModelByRole(normalizedRole);
    const profilePayload = extractRoleFields(normalizedRole, req.body);

    const newUser = await UserModel.create({
      name,
      email,
      password,
      role: normalizedRole,
      ...profilePayload,
    });

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      if (field === 'email') {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please log in instead.',
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Account could not be created due to a database conflict. Please try again.',
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation failed. Please check your input.',
      });
    }

    return res.status(500).json({ success: false, message: 'Signup failed. Please try again.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedRole = role ? getUserRole(role) : undefined;

    const user = await findUserByEmail(email, normalizedRole, true);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (normalizedRole && user.role !== normalizedRole) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as a ${user.role}, not a ${normalizedRole}. Please select the correct role.`,
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

module.exports = {
  signup,
  login,
  generateToken,
};
