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
            type: String,
        },
        nutrientLevels: {
            type: String,
        },
        organicMatter: {
            type: String,
        },
        nitrogen: {
            type: String,
        },
        phosphorus: {
            type: String,
        },
        potassium: {
            type: String,
        },
        calcium: {
            type: String,
        },
        magnetism: {
            type: String,
        },
        iron: {
            type: String,
        },
        manganese: {
            type: String,
        },
        boron: {
            type: String,
        },
        copper: {
            type: String,
        },
        zinc: {
            type: String,
        },
        cec: {
            type: String,
        },
        organicMa: {
            type: String,
        },
        heavyMetals: {
            type: String,
        },
        organicMatter: {
            type: String,
        },
        nutrients: {
            nitrogen: {
                level: String,
                interpretation: String
            },
            phosphorus: {
                level: String,
                interpretation: String
            },
            potassium: {
                level: String,
                interpretation: String
            }
        },
        soilTexture: {
            sand: String,
            silt: String,
            clay: String,
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