const mongoose = require('mongoose');
const { buildUserSchema } = require('./User');

const legacyUserSchema = buildUserSchema();
module.exports = mongoose.model('LegacyUser', legacyUserSchema, 'users');
