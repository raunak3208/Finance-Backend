// models/User.js
// This defines what a "User" looks like in our MongoDB database

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,           // removes extra spaces
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,         // no two users with same email
      lowercase: true,      // store emails in lowercase always
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ['viewer', 'analyst', 'admin'],  // only these 3 values allowed
      default: 'viewer',                     // new users are viewers by default
    },
  },
  {
    timestamps: true,   // auto adds createdAt and updatedAt fields
  }
);

// --- Hash password BEFORE saving to DB ---
// This runs automatically whenever we call user.save()
userSchema.pre('save', async function (next) {
  // 'this' refers to the current user document

  // Only hash if password was changed (avoid double-hashing)
  if (!this.isModified('password')) return next();

  // salt = random data added to password before hashing (makes it more secure)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next(); // continue saving
});

// --- Method to compare passwords during login ---
// We add this directly to the user object so we can call user.matchPassword()
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);