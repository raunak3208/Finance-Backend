const Record = require('../models/Record');

const buildFilter = (user, query) => {
  const { type, category, startDate, endDate, search } = query;

  // Admins can see all records, regular users only their own
  let filter = user.role === 'admin' ? {} : { user: user._id };
  
  // Exclude softly deleted records generally
  filter.isDeleted = { $ne: true };

  if (type)     filter.type     = type;

  if (category || search) {
    const searchTerm = category || search;
    filter.$or = [
      { category: { $regex: searchTerm, $options: 'i' } },
      { note:     { $regex: searchTerm, $options: 'i' } },
    ];
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate)   filter.date.$lte = new Date(endDate);
  }

  return filter;
};

// pagination + filtering 
const fetchRecords = async (user, query) => {
  const filter = buildFilter(user, query);
  const page  = parseInt(query.page)  || 1;  
  const limit = parseInt(query.limit) || 10; 
  const skip  = (page - 1) * limit;          

  const records = await Record.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .lean();                                  

  const total = await Record.countDocuments(filter);

  return {
    records,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

// Create a record
const createNewRecord = async (userId, data) => {
  const { amount, type, category, date, note } = data;
  return await Record.create({
    user: userId,
    amount,
    type,
    category,
    date: date || Date.now(),
    note,
  });
};

// Get single record by ID
const findRecordById = async (id) => {
  return await Record.findOne({ _id: id, isDeleted: { $ne: true } }).populate('user', 'name email').lean();
};

// Update a record 
const updateExistingRecord = async (record, data) => {
  const fields = ['amount', 'type', 'category', 'date', 'note'];
  fields.forEach(field => {
    if (data[field] !== undefined) record[field] = data[field];
  });
  return await record.save();
};

module.exports = {
  fetchRecords,
  createNewRecord,
  findRecordById,
  updateExistingRecord,
  buildFilter,
};