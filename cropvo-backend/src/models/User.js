const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const VALID_ROLES = ['patient', 'doctor', 'admin'];

const buildUserSchema = () => {
  const schema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        // Not unique — multiple users can share the same name
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      },
      role: {
        type: String,
        enum: VALID_ROLES,
        default: 'patient',
        required: true,
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
      },
    },
    { timestamps: true }
  );

  schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const bcryptHashRegex = /^\$2[aby]\$.{56}$/;
    if (bcryptHashRegex.test(this.password)) return next();

    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

  schema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
  };

  return schema;
};

module.exports = { VALID_ROLES, buildUserSchema };
