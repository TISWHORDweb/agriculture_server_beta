let express = require('express');
let router = express.Router();
let {errorHandle, useAsync} = require('../core');
//load middleware for admin
let {authMiddleware, roleMiddleware} = require('../middleware/middleware.protects');
//load controller for admin
let {availableRequests,updateSoilTestStatus,submitSoilTestResult,SingleFarmerTestRequest,agentAnalytics} = require('../controllers/controller.agent');

/* GET statistics data. */
router.get('/requests', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(availableRequests));
router.patch('/request/:requestId/:status', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(updateSoilTestStatus));
router.post('/request/:requestId/result', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(submitSoilTestResult));
router.get('/test-request/:requestId', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(SingleFarmerTestRequest));
router.get('/analytics', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(agentAnalytics));


module.exports = router;