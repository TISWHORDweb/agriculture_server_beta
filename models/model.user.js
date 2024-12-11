// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['farmer', 'agent', 'admin'],
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
    contact: String,
    middleName: String,
    address: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });


// Hash password before saving
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
  
    try {
      // Ensure password is not empty
      if (!this.password) {
        throw new Error('Password is required');
      }
  
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (error) {
      next(error);
    }
  });
  
  // Method to compare password
  UserSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
  
  // Custom error handling for duplicate keys
  UserSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      next(new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`));
    } else {
      next(error);
    }
  });
  
  module.exports = mongoose.model('User', UserSchema);