const mongoose = require('mongoose');
const { buildUserSchema } = require('./User');

const doctorSchema = buildUserSchema();

doctorSchema.add({
  specialty: { type: String },
  yearsExperience: { type: Number },
  clinic: { type: String },
  bio: { type: String },
  rating: { type: Number, default: 0 },
});

doctorSchema.pre('validate', function (next) {
  this.role = 'doctor';
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema, 'doctors');
