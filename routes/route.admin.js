let express = require('express');
let router = express.Router();
let {errorHandle, useAsync} = require('../core');
//load middleware for admin
let {authMiddleware, roleMiddleware} = require('../middleware/middleware.protects');
//load controller for admin
let {testRequests,users,deleteUser,analytics, AllResult, GetUserDetails, singleTestRequests, saveSoilData, getSoilData, getSingleSoilData, ApproveOrDeclineUser} = require('../controllers/controller.admin');
const { GetAllLands, GetSingleLand } = require('../controllers/controller.farmer');

/* GET statistics data. */
router.get('/users/:role', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(users));
router.put('/access/:id', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(ApproveOrDeclineUser));
router.get('/requests', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(testRequests));
router.get('/tests', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(AllResult));
router.get('/lands', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(GetAllLands));
router.delete('/delete-user', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(deleteUser));
router.get('/analytics', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(analytics));
router.get('/user/:id', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(GetUserDetails));
router.get('/request/:id', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(singleTestRequests));
router.get('/land/:id', useAsync(authMiddleware), useAsync(GetSingleLand));
router.post('/test/data', useAsync(saveSoilData));
router.get('/test/all', useAsync(getSoilData));
router.get('/test/:id', useAsync(getSingleSoilData));


module.exports = router;