// routes/farmerRoutes.js
const Land = require('../models/model.land');
const SoilTestRequest = require('../models/model.request');
const { useAsync, errorHandle, utils } = require('../core');
const { generateUniqueID } = require('../core/core.utils');

// Create a new land
exports.createLand = useAsync(async (req, res, next) => {
    try {
        const land = new Land({
            ...req.body,
            farmer: req.user._id
        });
        await land.save();

        res.json(utils.JParser("ok-response", !!land, land));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

// Create a soil test request for a specific land
exports.createSoilTest = useAsync(async (req, res, next) => {
    try {
        const land = await Land.findOne({
            _id: req.params.landId,
            farmer: req.user._id
        });

        if (!land) {
            return res.status(404).send({ error: 'Land not found' });
        }

        const testRequest = new SoilTestRequest({
            land: land._id,
            farmer: req.user._id,
            uniqueID: generateUniqueID(land.state ? land.state : "nigeria"),
            ...req.body
        });

        await testRequest.save();

        // Add request to land's soilTestRequests
        land.soilTestRequests.push(testRequest._id);
        await land.save();

        res.json(utils.JParser("ok-response", !!testRequest, testRequest));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

// Get all soil test requests for a farmer
exports.TestRequest = useAsync(async (req, res, next) => {
    try {
        const requests = await SoilTestRequest.find({
            farmer: req.user._id
        })
            .populate('land')
            .populate('agent', 'email profile');

        res.json(utils.JParser("ok-response", !!requests, requests));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

// Get all soil test requests for a farmer
exports.SingleTestRequest = useAsync(async (req, res, next) => {
    try {
        const requests = await SoilTestRequest.findOne({
            _id: req.params.id
        })
            .populate('land')
            .populate('agent', 'email profile');

        res.json(utils.JParser("ok-response", !!requests, requests));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

// Get all farmer lands
exports.GetLands = useAsync(async (req, res, next) => {
    try {
        const requests = await Land.find({
            farmer: req.user._id
        })
            .populate('soilTestRequests');

        res.json(utils.JParser("ok-response", !!requests, requests));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

exports.farmerAnalytics = useAsync(async (req, res, next) => {
    try {
        const farmerId = req.user._id

        const [pendingCount, completedCount, totalRequest] = await Promise.all([
            SoilTestRequest.countDocuments({ farmer: farmerId, status: 'pending' }),
            SoilTestRequest.countDocuments({ farmer: farmerId, status: 'completed' }),
            SoilTestRequest.countDocuments({ farmer: farmerId }),
        ]);

        const [LandCount] = await Promise.all([
            Land.countDocuments({ farmer: farmerId }),
        ]);

        const data = {
            TotalPending: pendingCount,
            TotalCompleted: completedCount,
            TotalLand: LandCount,
            TotalRequest: totalRequest
        };

        res.json(utils.JParser("ok-response", !!data, data));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});