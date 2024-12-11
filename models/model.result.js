// models/SoilTestResult.js
const mongoose = require('mongoose');

const SoilTestResultSchema = new mongoose.Schema({
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SoilTestRequest',
        required: true
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testDate: {
        type: Date,
        default: Date.now
    },
    results: {
        pH: {
            value: Number,
            interpretation: String
        },
        nutrientLevels: {
            value: Number,
            interpretation: String
        },
        organicMatter: {
            value: Number,
            interpretation: String
        },
        nitrogen: {
            value: Number,
            interpretation: String
        },
        phosphorus: {
            value: Number,
            interpretation: String
        },
        potassium: {
            value: Number,
            interpretation: String
        },
        calcium: {
            value: Number,
            interpretation: String
        },
        magnetism: {
            value: Number,
            interpretation: String
        },
        iron: {
            value: Number,
            interpretation: String
        },
        manganese: {
            value: Number,
            interpretation: String
        },
        boron: {
            value: Number,
            interpretation: String
        },
        copper: {
            value: Number,
            interpretation: String
        },
        zinc: {
            value: Number,
            interpretation: String
        },
        cec: {
            value: Number,
            interpretation: String
        },
        organicMa: {
            value: Number,
            interpretation: String
        },
        heavyMetals: {
            value: Number,
            interpretation: String
        },
        organicMatter: {
            percentage: Number,
            interpretation: String
        },
        nutrients: {
            nitrogen: {
                level: Number,
                interpretation: String
            },
            phosphorus: {
                level: Number,
                interpretation: String
            },
            potassium: {
                level: Number,
                interpretation: String
            }
        },
        soilTexture: {
            sand: Number,
            silt: Number,
            clay: Number,
            textureClass: String
        },
        salinity: {
            electricalConductivity: Number,
            interpretation: String
        },
        recommendedCrops: [String],
        additionalRecommendations: String
    }
}, { timestamps: true });

module.exports = mongoose.model('SoilTestResult', SoilTestResultSchema);