const express    = require('express');
const router     = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAlerts,
  getSettings,
  updateSettings,
} = require('../controllers/alertController');

router.get('/',          protect, getAlerts);

// get current thresholds
router.get('/settings',  protect, getSettings);

// update thresholds
router.put('/settings',  protect, updateSettings);

module.exports = router;