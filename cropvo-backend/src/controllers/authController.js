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
      return res.status(400).json({ success: false, message: 'Email already registered' });
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
    res.status(500).json({ success: false, message: error.message || 'Signup failed' });
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
        message: `This account is not registered as ${normalizedRole}. Please select the correct role.`,
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
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

module.exports = {
  signup,
  login,
  generateToken,
};
