let express = require('express');
let router = express.Router();
let {errorHandle, useAsync} = require('../core');
//load middleware for admin
let {authMiddleware, roleMiddleware} = require('../middleware/middleware.protects');
//load controller for admin
let {availableRequests,updateSoilTestStatus,submitSoilTestResult,SingleFarmerTestRequest,agentAnalytics,SingleResult,completedRequests,acceptedRequests, createFertilizerRecommendations} = require('../controllers/controller.agent');

/* GET statistics data. */
router.get('/requests', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(availableRequests));
router.patch('/request/:requestId/:status', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(updateSoilTestStatus));
router.post('/request/:requestId/result', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(submitSoilTestResult));
router.post('/recommendations', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(createFertilizerRecommendations));
router.get('/test-request/:requestId', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(SingleFarmerTestRequest));
router.get('/analytics', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(agentAnalytics));
router.get('/request/result/:id', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(SingleResult));
router.get('/request/assigned', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(acceptedRequests));
router.get('/request/completed', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(completedRequests));


module.exports = router;