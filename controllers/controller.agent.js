// routes/agentRoutes.js
const SoilTestRequest = require('../models/model.request');
const SoilTestResult = require('../models/model.result');
const User = require('../models/model.user');
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
        const agentId = req.user._id;

        // Fetch counts in parallel
        const [completedCount, pendingCount, inProgressCount, totalRequest, assignedFarmersCount] = await Promise.all([
            SoilTestRequest.countDocuments({ agent: agentId, status: 'completed' }),
            SoilTestRequest.countDocuments({ agent: agentId, status: 'pending' }),
            SoilTestRequest.countDocuments({ agent: agentId, status: 'in-progress' }),
            SoilTestRequest.countDocuments({ agent: agentId }),
            User.countDocuments({ assignedAgent: agentId, role: 'farmer' })
        ]);

        // Fetch recent requests with detailed population
        const recentRequests = await SoilTestRequest.find({ agent: agentId })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate({
                path: 'farmer',
                select: 'profile firstName lastName email'
            })
            .populate({
                path: 'land',
                select: 'name image totalArea location currentCrop',
                populate: {
                    path: 'location',
                    select: 'address state lga ward coordinates'
                }
            });

        // Format the response data with proper null checks
        const data = {
            TotalCompleted: completedCount || 0,
            TotalPending: pendingCount || 0,
            TotalInProgress: inProgressCount || 0,
            TotalAssignedFarmers: assignedFarmersCount || 0,
            TotalRequest: totalRequest || 0,
            RecentRequests: recentRequests.map(request => ({
                _id: request._id,
                status: request.status || 'unknown',
                source: request.source || 'unknown',
                uniqueID: request.uniqueID || '',
                desiredTestComponents: request.desiredTestComponents || [],
                additionalNotes: request.additionalNotes || '',
                requestDate: request.requestDate || new Date(),
                createdAt: request.createdAt || new Date(),
                farmer: {
                    _id: request.farmer?._id || '',
                    firstName: request.farmer?.firstName || '',
                    lastName: request.farmer?.lastName || '',
                    email: request.farmer?.email || '',
                    profile: {
                        ...(request.farmer?.profile || {}),
                        contact: request.farmer?.profile?.contact || '',
                        image: request.farmer?.profile?.image || ''
                    }
                },
                land: {
                    _id: request.land?._id || '',
                    name: request.land?.name || 'Unnamed Land',
                    image: request.land?.image || null,
                    currentCrop: request.land?.currentCrop || 'Not specified',
                    totalArea: {
                        value: request.land?.totalArea?.value || 0,
                        unit: request.land?.totalArea?.unit || 'acres'
                    },
                    location: {
                        address: request.land?.location?.address || 'Address not specified',
                        state: request.land?.location?.state || '',
                        lga: request.land?.location?.lga || '',
                        ward: request.land?.location?.ward || '',
                        coordinates: {
                            latitude: request.land?.location?.coordinates?.latitude || 0,
                            longitude: request.land?.location?.coordinates?.longitude || 0
                        }
                    }
                }
            }))
        };

        res.json(utils.JParser("ok-response", true, data));
    } catch (error) {
        console.error('Agent analytics error:', error);
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
              { path: 'farmer', model: 'User' } 
            ]
          })
          .populate('agent')

          console.log(requests)

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
