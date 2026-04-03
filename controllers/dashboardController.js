const Record = require('../models/Record');

const getMatchFilter = (user) => {
  if (user.role === 'admin') return {}; // no filter = all records
  return { user: user._id };
};
const getSummary = async (req, res) => {
  try {
    const matchFilter = getMatchFilter(req.user);
    const result = await Record.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$type',           
          total: { $sum: '$amount' } 
        }
      }
    ]);

    // Convert array to a clean object
    let income  = 0;
    let expense = 0;

    result.forEach(item => {
      if (item._id === 'income')  income  = item.total;
      if (item._id === 'expense') expense = item.total;
    });

    res.json({
      totalIncome:  income,
      totalExpense: expense,
      netBalance:   income - expense,
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getByCategory = async (req, res) => {
  try {
    const matchFilter = getMatchFilter(req.user);

    const result = await Record.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { category: '$category', type: '$type' }, // group by category + type
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } } // highest first
    ]);


    res.json({
      message: 'Category-wise totals',
      data: result.map(item => ({
        category: item._id.category,
        type:     item._id.type,
        total:    item.total,
      })),
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const matchFilter = getMatchFilter(req.user);

    const result = await Record.aggregate([
      { $match: matchFilter },
      {
        $group: {
          // Group by year + month + type
          _id: {
            year:  { $year: '$date' },  
            month: { $month: '$date' }, 
            type:  '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
      
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const trendsMap = {};

    result.forEach(item => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;

      if (!trendsMap[key]) {
        trendsMap[key] = { month: key, income: 0, expense: 0 };
      }

      if (item._id.type === 'income')  trendsMap[key].income  = item.total;
      if (item._id.type === 'expense') trendsMap[key].expense = item.total;
    });
    
    const trends = Object.values(trendsMap);

    res.json({
      message: 'Monthly trends',
      data: trends,
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getSummary, getByCategory, getMonthlyTrends };