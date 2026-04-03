const Record = require('../models/Record');

const {
  fetchRecords,
  createNewRecord,
  findRecordById,
  updateExistingRecord,
} = require('../services/recordService');


// Create Record 
const createRecord = async (req, res, next) => {
  try {
    const record = await createNewRecord(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: 'Record created',
      record,
    });
  } catch (err) {
    next(err); 
  }
};


// Get All Records (filters handled in service)
const getRecords = async (req, res, next) => {
  try {
    const result = await fetchRecords(req.user, req.query);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};


// Get Single Record
const getRecordById = async (req, res, next) => {
  try {
    const record = await findRecordById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // ownership check
    const isOwner = record.user._id.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.json({
      success: true,
      record,
    });
  } catch (err) {
    next(err);
  }
};


// Update Record
const updateRecord = async (req, res, next) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, isDeleted: false });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    const isOwner = record.user.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const updated = await updateExistingRecord(record, req.body);

    res.json({
      success: true,
      message: 'Record updated',
      record: updated,
    });
  } catch (err) {
    next(err);
  }
};


// Delete Record - owner or admin
const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, isDeleted: false });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    const isOwner = record.user.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    record.isDeleted = true;
    record.deletedAt = new Date();
    await record.save();

    res.json({
      success: true,
      message: 'Record deleted',
    });
  } catch (err) {
    next(err);
  }
};


// Get Deleted Records (admin only)
const getDeletedRecords = async (req, res, next) => {
  try {
    const records = await Record.find({ isDeleted: true }).populate('user', 'name email').lean();
    res.json({
      success: true,
      records,
    });
  } catch (err) {
    next(err);
  }
};

// Restore Deleted Record (admin only)
const restoreDeletedRecord = async (req, res, next) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, isDeleted: true });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Deleted record not found',
      });
    }

    record.isDeleted = false;
    record.deletedAt = null;
    await record.save();

    res.json({
      success: true,
      message: 'Record restored',
      record,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  getDeletedRecords,
  restoreDeletedRecord,
};