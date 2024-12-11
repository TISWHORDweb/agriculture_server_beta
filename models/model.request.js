// models/SoilTestRequest.js
const mongoose = require('mongoose');

const SoilTestRequestSchema = new mongoose.Schema({
  land: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land',
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: [
      'pending', 
      'assigned', 
      'in-progress', 
      'completed', 
      'cancelled'
    ],
    default: 'pending'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  desiredTestComponents: [{
    type: String,
    enum: [
      'pH', 
      'nutrient levels', 
      'organic matter', 
      'soil texture', 
      'salinity', 
      'heavy metals'
    ]
  }],
  additionalNotes: String
}, { timestamps: true });

module.exports = mongoose.model('SoilTestRequest', SoilTestRequestSchema);