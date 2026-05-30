const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');

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
  const select = includePassword ? '+password' : undefined;

  // Search the role-specific collection first
  if (role) {
    const model = getModelByRole(role);
    const q = model.findOne({ email });
    const user = select ? await q.select(select) : await q;
    if (user) return user;
    // Fall through to search all collections if not found in primary
  }

  // Search all collections
  for (const currentRole of VALID_ROLES) {
    const model = getModelByRole(currentRole);
    const q = model.findOne({ email });
    const user = select ? await q.select(select) : await q;
    if (user) return user;
  }

  return null;
};

const findUserById = async (id, role, includePassword = false) => {
  const select = includePassword ? '+password' : undefined;

  if (role) {
    const model = getModelByRole(role);
    const q = model.findById(id);
    return select ? q.select(select) : q;
  }

  for (const currentRole of VALID_ROLES) {
    const model = getModelByRole(currentRole);
    const q = model.findById(id);
    const user = select ? await q.select(select) : await q;
    if (user) return user;
  }

  return null;
};

const getAllUsers = async () => {
  const [patients, doctors, admins] = await Promise.all([
    Patient.find().select('-password -__v'),
    Doctor.find().select('-password -__v'),
    Admin.find().select('-password -__v'),
  ]);

  return [
    ...patients.map((doc) => ({ ...doc.toObject(), role: 'patient' })),
    ...doctors.map((doc) => ({ ...doc.toObject(), role: 'doctor' })),
    ...admins.map((doc) => ({ ...doc.toObject(), role: 'admin' })),
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
    if (data[field] !== undefined) payload[field] = data[field];
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
