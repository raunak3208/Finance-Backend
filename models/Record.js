const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    // Which user created this record
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',                         
      required: true,
    },

    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },

    type: {
      type: String,
      enum: ['income', 'expense'],           
      required: [true, 'Type is required'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },

    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },

    note: {
      type: String,
      trim: true,
      default: '',                           
    },
    isDeleted: {
      type: Boolean,
      default: false,   
    },

    deletedAt: {
      type: Date,
      default: null,   
    },
  },
  {
    timestamps: true,
  }
);


recordSchema.index({ user: 1 });        
recordSchema.index({ type: 1 });       
recordSchema.index({ date: -1 });       
recordSchema.index({ category: 1 });   

recordSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Record', recordSchema);