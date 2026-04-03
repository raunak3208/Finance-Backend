
const { checkAlerts, getOrCreateSettings } = require('../services/alertService');
const UserSettings                          = require('../models/UserSettings');
const getAlerts = async (req, res, next) => {
  try {
    const { alerts, meta } = await checkAlerts(req.user._id);

    res.json({
      success:     true,
      alertCount:  alerts.length,
      hasAlerts:   alerts.length > 0,
      alerts,
      meta,         // budget usage, balance etc for frontend dashboard
    });

  } catch (err) { next(err); }
};

const getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings(req.user._id);

    res.json({ success: true, settings });

  } catch (err) { next(err); }
};

const updateSettings = async (req, res, next) => {
  try {
    const { monthlyBudget, lowBalanceThreshold } = req.body;

    // Validate inputs
    if (monthlyBudget !== undefined && monthlyBudget < 0) {
      return res.status(400).json({
        success: false,
        message: 'Monthly budget cannot be negative',
      });
    }

    if (lowBalanceThreshold !== undefined && lowBalanceThreshold < 0) {
      return res.status(400).json({
        success: false,
        message: 'Low balance threshold cannot be negative',
      });
    }

    // findOneAndUpdate with upsert:
    // update if exists, create if not — one operation
    const settings = await UserSettings.findOneAndUpdate(
      { user: req.user._id },
      {
        ...(monthlyBudget        !== undefined && { monthlyBudget }),
        ...(lowBalanceThreshold  !== undefined && { lowBalanceThreshold }),
      },
      {
        new:    true,   // return updated document
        upsert: true,   // create if doesn't exist
      }
    );

    res.json({
      success:  true,
      message:  'Alert settings updated',
      settings,
    });

  } catch (err) { next(err); }
};

module.exports = { getAlerts, getSettings, updateSettings };