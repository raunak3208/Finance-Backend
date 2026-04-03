const Record = require('../models/Record');
const { Parser } = require('json2csv');

const fetchRecordsForExport = async (user, query) => {
  const { type, category, startDate, endDate } = query;

  // Base filter 
  let filter = { isDeleted: false };

  // Admins export all, others export only their own
  if (user.role !== 'admin') filter.user = user._id;

  if (type) filter.type = type;
  if (category) filter.category = { $regex: category, $options: 'i' };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  
  const records = await Record.find(filter)
    .sort({ date: -1 })
    .populate('user', 'name email')
    .lean();

  return records;
};


const formatRecords = (records) => {
  return records.map(r => ({
    id: r._id,
    amount: r.amount,
    type: r.type,
    category: r.category,
    date: new Date(r.date).toISOString().split('T')[0], // YYYY-MM-DD
    note: r.note || '',
    userName: r.user?.name || '',
    userEmail: r.user?.email || '',
    createdAt: new Date(r.createdAt).toISOString().split('T')[0],
  }));
};


const convertToCSV = (records) => {
  // Define exact columns and their order in CSV
  const fields = [
    { label: 'ID', value: 'id' },
    { label: 'Amount', value: 'amount' },
    { label: 'Type', value: 'type' },
    { label: 'Category', value: 'category' },
    { label: 'Date', value: 'date' },
    { label: 'Note', value: 'note' },
    { label: 'User Name', value: 'userName' },
    { label: 'User Email', value: 'userEmail' },
    { label: 'Created At', value: 'createdAt' },
  ];

  const parser = new Parser({ fields });
  return parser.parse(records); // returns CSV string
};

module.exports = {
  fetchRecordsForExport,
  formatRecords,
  convertToCSV,
};