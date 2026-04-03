const Record = require('../models/Record');
const UserSettings = require('../models/UserSettings');


const getOrCreateSettings = async (userId) => {
  let settings = await UserSettings.findOne({ user: userId });

  if (!settings) {
    // First time 
    settings = await UserSettings.create({ user: userId });
  }

  return settings;
};


const getMonthlyExpenses = async (userId) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  // month + 1, day 0 = last day of current month

  const result = await Record.aggregate([
    {
      $match: {
        user: userId,
        type: 'expense',
        isDeleted: false,
        date: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

// Calculate net balance
const getNetBalance = async (userId) => {
  const result = await Record.aggregate([
    {
      $match: {
        user: userId,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
      },
    },
  ]);

  let income = 0;
  let expense = 0;

  result.forEach(item => {
    if (item._id === 'income') income = item.total;
    if (item._id === 'expense') expense = item.total;
  });

  return income - expense;
};

// check all alert conditions 
const checkAlerts = async (userId) => {
  // Run all calculations in parallel for speed
  const [settings, monthlyExpenses, netBalance] = await Promise.all([
    getOrCreateSettings(userId),
    getMonthlyExpenses(userId),
    getNetBalance(userId),
  ]);

  const alerts = [];  
  const meta = {};   

  // High Spending 
  if (monthlyExpenses > settings.monthlyBudget) {
    const overspent = monthlyExpenses - settings.monthlyBudget;
    alerts.push({
      type: 'HIGH_SPENDING',
      severity: 'warning',
      message: `You have exceeded your monthly budget of ${settings.monthlyBudget}. Overspent by ${overspent}.`,
    });
  }

  // Approaching Budget 
  const budgetUsedPercent = (monthlyExpenses / settings.monthlyBudget) * 100;
  if (budgetUsedPercent >= 80 && budgetUsedPercent <= 100) {
    alerts.push({
      type: 'BUDGET_WARNING',
      severity: 'info',
      message: `You have used ${budgetUsedPercent.toFixed(1)}% of your monthly budget.`,
    });
  }

  // Low Balance 
  if (netBalance < settings.lowBalanceThreshold) {
    alerts.push({
      type: 'LOW_BALANCE',
      severity: 'danger',
      message: `Your balance (${netBalance}) is below the threshold of ${settings.lowBalanceThreshold}.`,
    });
  }

  // Meta info for frontend 
  meta.monthlyExpenses = monthlyExpenses;
  meta.monthlyBudget = settings.monthlyBudget;
  meta.budgetUsedPercent = parseFloat(budgetUsedPercent.toFixed(1));
  meta.netBalance = netBalance;
  meta.lowBalanceThreshold = settings.lowBalanceThreshold;

  return { alerts, meta };
};

module.exports = {
  checkAlerts,
  getOrCreateSettings,
};