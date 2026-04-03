const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema(
  {
    // One settings document per user
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      unique:   true,  
    },


    monthlyBudget: {
      type:    Number,
      default: 50000,   // default budget = 50,000
      min:     [0, 'Budget cannot be negative'],
    },

    
    lowBalanceThreshold: {
      type:    Number,
      default: 5000,    // alert if balance drops below 5,000
      min:     [0, 'Threshold cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserSettings', userSettingsSchema);