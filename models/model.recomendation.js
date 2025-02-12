const mongoose = require('mongoose');

// Define the schema for a crop's fertilizer recommendations
const CropFertilizerSchema = new mongoose.Schema({
    crop: {
        type: String,
        required: true,
        enum: ['RICE', 'MAIZE'], // Add other crops if needed
    },
    resultId: {
        type: String,
        required: true,
    },
    preplanting: {
        input: {
            type: String,
            default: "MANURE/COMPOST **",
        },
        kgPerHa: {
            type: String,
        },
        bagsPerHa: {
            type: String,
        },
    },
    planting: {
        input: {
            type: String,
            default: "NPK (15.15.15)",
        },
        kgPerHa: {
            type: String,
        },
        bagsPerHa: {
            type: String,
        },
    },
    topDressUrea: {
        input: {
            type: String,
            default: "Urea",
        },
        kgPerHa: {
            type: String,
        },
        bagsPerHa: {
            type: String,
        },
    },
    topDressMOP: {
        input: {
            type: String,
            default: "MOP",
        },
        kgPerHa: {
            type: String,
        },
        bagsPerHa: {
            type: String,
        },
    },
});

// Create the model
const CropFertilizerModel = mongoose.model('CropFertilizer', CropFertilizerSchema);

module.exports = CropFertilizerModel;