const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const {
  getSummary,
  getByCategory,
  getMonthlyTrends,
} = require('../controllers/dashboardController');

// All dashboard routes require login
router.get('/summary',        protect, getSummary);
router.get('/by-category',    protect, getByCategory);
router.get('/monthly-trends', protect, getMonthlyTrends);

module.exports = router;