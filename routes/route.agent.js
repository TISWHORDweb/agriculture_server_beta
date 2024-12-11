let express = require('express');
let router = express.Router();
let {errorHandle, useAsync} = require('../core');
//load middleware for admin
let {authMiddleware, roleMiddleware} = require('../middleware/middleware.protects');
//load controller for admin
let {availableRequests,AcceptSoilTest,submitSoilTestResult} = require('../controllers/controller.agent');

/* GET statistics data. */
router.get('/requests', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(availableRequests));
router.patch('/request/:requestId/accept', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(AcceptSoilTest));
router.post('request/:requestId/result', useAsync(authMiddleware), useAsync(roleMiddleware(['agent'])), useAsync(submitSoilTestResult));


module.exports = router;