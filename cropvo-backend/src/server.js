// ============================================
// Crovo Backend - Main Server File
// ============================================
// Production-level backend with MVC architecture
// Proper middleware, controllers, and error handling

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware Configuration
// ============================================

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - restrict to frontend URL in production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ============================================
// Health Check Route
// ============================================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Crovo Backend API',
    version: '1.0.0',
    status: 'Running',
  });
});

// ============================================
// API Routes
// ============================================

// Authentication routes
app.use('/auth', authRoutes);

// User routes
app.use('/', userRoutes);

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ============================================
// Global Error Handler
// ============================================
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

/**
 * Connect to MongoDB and start server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('✗ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
