const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const LegacyUser = require('../models/LegacyUser');

const VALID_ROLES = ['patient', 'doctor', 'admin'];

const roleToModel = {
  patient: Patient,
  doctor: Doctor,
  admin: Admin,
};

const getModelByRole = (role = 'patient') => {
  const normalizedRole = String(role || 'patient').toLowerCase();
  return roleToModel[normalizedRole] || Patient;
};

const getUserRole = (role) => {
  const normalizedRole = String(role || 'patient').toLowerCase();
  return VALID_ROLES.includes(normalizedRole) ? normalizedRole : 'patient';
};

const findUserByEmail = async (email, role, includePassword = false) => {
  const field = includePassword ? '+password' : undefined;

  if (role) {
    const model = getModelByRole(role);
    return field ? model.findOne({ email }).select(field) : model.findOne({ email });
  }

  for (const currentRole of VALID_ROLES) {
    const model = getModelByRole(currentRole);
    const query = model.findOne({ email });
    const user = field ? await query.select(field) : await query;
    if (user) return user;
  }

  if (LegacyUser) {
    const legacyQuery = LegacyUser.findOne({ email });
    return field ? legacyQuery.select(field) : legacyQuery;
  }

  return null;
};

const findUserById = async (id, role, includePassword = false) => {
  const field = includePassword ? '+password' : undefined;

  if (role) {
    const model = getModelByRole(role);
    return field ? model.findById(id).select(field) : model.findById(id);
  }

  for (const currentRole of VALID_ROLES) {
    const model = getModelByRole(currentRole);
    const query = model.findById(id);
    const user = field ? await query.select(field) : await query;
    if (user) return user;
  }

  if (LegacyUser) {
    const legacyQuery = LegacyUser.findById(id);
    return field ? legacyQuery.select(field) : legacyQuery;
  }

  return null;
};

const getAllUsers = async () => {
  const [patients, doctors, admins, legacyUsers] = await Promise.all([
    Patient.find().select('-password -__v'),
    Doctor.find().select('-password -__v'),
    Admin.find().select('-password -__v'),
    LegacyUser.find().select('-password -__v'),
  ]);

  return [
    ...patients.map((doc) => ({ ...doc.toObject(), role: 'patient' })),
    ...doctors.map((doc) => ({ ...doc.toObject(), role: 'doctor' })),
    ...admins.map((doc) => ({ ...doc.toObject(), role: 'admin' })),
    ...legacyUsers.map((doc) => ({ ...doc.toObject(), role: doc.role || 'patient' })),
  ];
};

const extractRoleFields = (role, data = {}) => {
  const normalizedRole = getUserRole(role);
  const fieldsByRole = {
    patient: ['phone', 'dob', 'medicalHistory'],
    doctor: ['specialty', 'yearsExperience', 'clinic', 'bio', 'rating'],
    admin: ['department', 'permissions'],
  };

  const profileFields = fieldsByRole[normalizedRole] || [];
  return profileFields.reduce((payload, field) => {
    if (data[field] !== undefined) {
      payload[field] = data[field];
    }
    return payload;
  }, {});
};

module.exports = {
  VALID_ROLES,
  getUserRole,
  getModelByRole,
  findUserByEmail,
  findUserById,
  getAllUsers,
  extractRoleFields,
};
