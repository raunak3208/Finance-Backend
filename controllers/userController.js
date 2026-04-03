const User = require('../models/User');
const getMe = async (req, res) => {
  try {
    res.json({
      message: 'Your profile',
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAnalystData = async (req, res) => {
  try {
    res.json({
      message: `Hello ${req.user.name}! Here is analyst-level data.`,
      data: {
        totalReports: 42,
        pendingReview: 5,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Fetch all users but hide their passwords
    const users = await User.find().select('-password');

    res.json({
      message: 'All registered users',
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    await user.deleteOne();

    res.json({ message: `User ${user.name} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getMe, getAnalystData, getAllUsers, deleteUser };