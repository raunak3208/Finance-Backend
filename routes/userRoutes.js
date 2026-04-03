const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const {
  getMe,
  getAnalystData,
  getAllUsers,
  deleteUser,
} = require('../controllers/userController');

router.get('/me', protect, getMe);

router.get('/analyst-data', protect, allowRoles('analyst', 'admin'), getAnalystData);

// Admin only
router.get('/all', protect, allowRoles('admin'), getAllUsers);

// Admin only
router.delete('/:id', protect, allowRoles('admin'), deleteUser);

module.exports = router;