const mongoose = require('mongoose');
const { buildUserSchema } = require('./User');

const adminSchema = buildUserSchema();

adminSchema.add({
  department: { type: String },
  permissions: { type: [String], default: ['manage_users'] },
});

adminSchema.pre('validate', function (next) {
  this.role = 'admin';
  next();
});

module.exports = mongoose.model('Admin', adminSchema, 'admins');
