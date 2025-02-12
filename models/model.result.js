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
        available: {
            type: String,
        },
        exchangeable: {
            type: String,
        },
        calcium: {
            type: String,
        },
        magnesium: {
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
        totalNitrogen: {
            type: String,
        },
        organicMatter: {
            type: String,
        },
        cn: {
            type: String,
        },
        soilTexture: {
            type: String,
        },
        comment: {
            preplanting: String,
            planting: String,
            topDressUrea: String,
            topDressMOP: String
        },
        recommendedCrops: [String],
        additionalRecommendations: String
    }
}, { timestamps: true });

module.exports = mongoose.model('SoilTestResult', SoilTestResultSchema);
