// models/Land.js
const mongoose = require('mongoose');

const LandSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        state: {
            type: String,
            required: true
        },
        address: String,
        ward: String,
        lga: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    totalArea: {
        value: Number,
        unit: {
            type: String,
            enum: ['acres', 'hectares', 'square meters']
        }
    },
    landType: {
        type: String,
        enum: ['agricultural', 'pasture', 'orchard', 'other']
    },
    currentCrop: String,
    soilTestRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SoilTestRequest'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Land', LandSchema);