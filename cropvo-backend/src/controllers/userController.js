// ============================================
// User Controller
// ============================================
// Handles user-related operations

const {
  getModelByRole,
  findUserById,
  getAllUsers: fetchAllUsers,
  getUserRole,
  extractRoleFields,
} = require('../utils/userModels');

const getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch users' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await findUserById(req.userId, req.userRole);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const responseUser = user.toObject({ getters: true, virtuals: false });
    delete responseUser.password;
    res.json({ success: true, data: responseUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch profile' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requestedRole = req.body.role;
    const normalizedRole = requestedRole ? getUserRole(requestedRole) : undefined;

    const existingUser = await findUserById(id, undefined, true);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentModel = getModelByRole(existingUser.role);
    const targetRole = normalizedRole || existingUser.role;
    const targetModel = getModelByRole(targetRole);

    const updatePayload = {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.email && { email: req.body.email }),
      ...(normalizedRole && { role: normalizedRole }),
      ...extractRoleFields(targetRole, req.body),
    };

    let updatedUser;
    if (normalizedRole && normalizedRole !== existingUser.role) {
      const migratedData = {
        _id: existingUser._id,
        name: updatePayload.name || existingUser.name,
        email: updatePayload.email || existingUser.email,
        password: existingUser.password,
        role: normalizedRole,
        ...extractRoleFields(normalizedRole, req.body),
      };

      await currentModel.findByIdAndDelete(id);
      const newUser = new targetModel(migratedData);
      updatedUser = await newUser.save();
    } else {
      updatedUser = await currentModel.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
        select: '-password',
      });
    }

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const responseUser = updatedUser.toObject({ getters: true, virtuals: false });
    delete responseUser.password;

    res.json({ success: true, data: responseUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await findUserById(id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const model = getModelByRole(existingUser.role);
    await model.findByIdAndDelete(id);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete user' });
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUser,
  deleteUser,
};
