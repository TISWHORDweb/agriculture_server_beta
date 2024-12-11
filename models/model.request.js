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
  source: {
    type: String,
    default: 'FMAFS'
  },
  uniqueID: {
    type: String,
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
      'nitrogen', 
      'phosphorus', 
      'potassium', 
      'calcium', 
      'magnetism', 
      'iron', 
      'manganese', 
      'boron',
      'copper',
      'zinc',
      'cec',
      'organic ma',
      'heavy metals'
    ]
  }],
  additionalNotes: String
}, { timestamps: true });

module.exports = mongoose.model('SoilTestRequest', SoilTestRequestSchema);