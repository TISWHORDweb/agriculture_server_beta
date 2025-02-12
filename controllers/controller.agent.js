// routes/agentRoutes.js
const SoilTestRequest = require('../models/model.request');
const SoilTestResult = require('../models/model.result');
const { useAsync, errorHandle, utils } = require('../core');
const CropFertilizerModel = require('../models/model.recomendation');

// Get available soil test requests
exports.availableRequests = useAsync(async (req, res, next) => {

    try {
        const requests = await SoilTestRequest.find({
            status: { $in: ['pending', 'assigned'] }
          })          
            .populate('land')
            .populate('farmer', 'email profile');

        res.json(utils.JParser("ok-response", !!requests, requests));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

// Get accepted soil test requests
exports.acceptedRequests = useAsync(async (req, res, next) => {

    try {
        const requests = await SoilTestRequest.find({
            status: { $nin: ['pending'] }
        })
            .populate('land')
            .populate('farmer', 'email profile');

        res.json(utils.JParser("ok-response", !!requests, requests));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

exports.completedRequests = useAsync(async (req, res, next) => {

    try {
        const requests = await SoilTestRequest.find({
            status: 'completed',
            agent: req.user._id,
        })
            .populate('land')
            .populate('farmer', 'email profile');

        res.json(utils.JParser("ok-response", !!requests, requests));
    } catch (error) {
        throw new errorHandle(error.message, 500);
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
        throw new errorHandle(error.message, 500);
    }
});

// Submit soil test results
exports.submitSoilTestResult = useAsync(async (req, res, next) => {
    try {
        const request = await SoilTestRequest.findOne({
            _id: req.params.requestId
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
        throw new errorHandle(error.message, 500);
    }
});

// Get all soil test requests for a farmer
exports.SingleFarmerTestRequest = useAsync(async (req, res, next) => {
    try {
      const requests = await SoilTestRequest.findOne({ 
        _id: req.params.requestId 
      })
      .populate('land')
      .populate('farmer', 'email profile');
    
      res.json(utils.JParser("ok-response", !!requests, requests));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

exports.agentAnalytics = useAsync(async (req, res, next) => {
    try {
        const agentId = req.user._id

        const [ completedCount, totalRequest] = await Promise.all([
            SoilTestRequest.countDocuments({ agent: agentId, status: 'completed' }),
            SoilTestRequest.countDocuments({ agent: agentId }),
        ]);

        const [resultCount] = await Promise.all([
            SoilTestResult.countDocuments({ agent: agentId }),
        ]);

        const request = await SoilTestRequest.find({ agent: agentId }).limit(3)

        const data = {
            TotalCompleted: completedCount,
            TotalRequest: totalRequest,
            ResultCount: resultCount,
            request
        };

        res.json(utils.JParser("ok-response", !!data, data));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

// Get single test result
exports.SingleResult = useAsync(async (req, res, next) => {
    try {
        const requests = await SoilTestResult.findOne({
            request: req.params.id
        })
        .populate({
            path: 'request',
            populate: [
              { path: 'land', model: 'Land' },
              { path: 'farmer', model: 'User', select: 'name profile' } 
            ]
          })
          .populate('agent')

        const recommendations = await CropFertilizerModel.find({ resultId: requests._id });

        res.json(utils.JParser("ok-response", !!requests, {requests,recommendations}));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});


exports.createFertilizerRecommendations = useAsync(async (req, res, next) => {
    try {
        const recommendations = req.body; // Array of recommendations from the request body

        // Bulk create the recommendations
        const createdRecommendations = await CropFertilizerModel.insertMany(recommendations);

        res.json(utils.JParser("ok-response", !!createdRecommendations, createdRecommendations));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});


exports.getFertilizerRecommendationsByResultId = useAsync(async (req, res, next) => {
    try {
        const { resultId } = req.params; // Get the result ID from the params

        // Find all recommendations associated with the result ID
        const recommendations = await CropFertilizerModel.find({ result: resultId });

        if (!recommendations || recommendations.length === 0) {
            return res.status(404).send({ error: 'No recommendations found for this result ID' });
        }

        res.json(utils.JParser("ok-response", !!recommendations, recommendations));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});
