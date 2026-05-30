const mongoose = require('mongoose');
const { buildUserSchema } = require('./User');

const patientSchema = buildUserSchema();

patientSchema.add({
  phone: { type: String },
  dob: { type: Date },
  medicalHistory: { type: String },
});

patientSchema.pre('validate', function (next) {
  this.role = 'patient';
  next();
});

module.exports = mongoose.model('Patient', patientSchema, 'patients');
