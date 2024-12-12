// routes/agentRoutes.js
const SoilTestRequest = require('../models/model.request');
const SoilTestResult = require('../models/model.result');
const { useAsync, errorHandle, utils } = require('../core');

// Get available soil test requests
exports.availableRequests = useAsync(async (req, res, next) => {

    try {
        const requests = await SoilTestRequest.find({
            status: 'pending'
        })
            .populate('land')
            .populate('farmer', 'email profile');

        res.json(utils.JParser("ok-response", !!requests, requests));
    } catch (error) {
        throw new errorHandle(e.message, 500);
    }
});

// Accept a soil test request
exports.updateSoilTestStatus = useAsync(async (req, res, next) => {
    try {
        const request = await SoilTestRequest.findByIdAndUpdate(
            req.params.requestId,
            {
                agent: req.user._id,
                status: req.params.status,
            },
            { new: true }
        );

        if (!request) {
            return res.status(404).send({ error: 'Request not found' });
        }

        res.json(utils.JParser("ok-response", !!request, request));
    } catch (error) {
        throw new errorHandle(e.message, 500);
    }
});

// Submit soil test results
exports.submitSoilTestResult = useAsync(async (req, res, next) => {
    try {
        const request = await SoilTestRequest.findOne({
            _id: req.params.requestId,
            agent: req.user._id
        });

        if (!request) {
            return res.status(404).send({ error: 'Request not found' });
        }

        const result = new SoilTestResult({
            request: request._id,
            agent: req.user._id,
            results: req.body
        });

        await result.save();

        // Update request status
        request.status = 'completed';
        await request.save();

        res.json(utils.JParser("ok-response", !!result, result));
    } catch (error) {
        throw new errorHandle(e.message, 500);
    }
});

// Get all soil test requests for a farmer
exports.SingleFarmerTestRequest = useAsync(async (req, res, next) => {
    try {
      const requests = await SoilTestRequest.find({ 
        _id: req.params.requestId 
      })
      .populate('land')
      .populate('farmer', 'email profile');
    
      res.json(utils.JParser("ok-response", !!requests, requests));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});