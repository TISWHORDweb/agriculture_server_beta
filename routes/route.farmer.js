let express = require('express');
let router = express.Router();
let {errorHandle, useAsync} = require('../core');
//load middleware for admin
let {authMiddleware, roleMiddleware} = require('../middleware/middleware.protects');
//load controller for admin
let {createLand,createSoilTest,TestRequest,GetLands,SingleTestRequest} = require('../controllers/controller.farmer');

/* GET statistics data. */
router.post('/land', useAsync(authMiddleware), useAsync(roleMiddleware(['farmer'])), useAsync(createLand));
router.post('/land/:landId/test-request', useAsync(authMiddleware), useAsync(roleMiddleware(['farmer'])), useAsync(createSoilTest));
router.get('/test-requests', useAsync(authMiddleware), useAsync(roleMiddleware(['farmer'])), useAsync(TestRequest));
router.get('/test-request/:id', useAsync(authMiddleware), useAsync(roleMiddleware(['farmer'])), useAsync(SingleTestRequest));
router.get('/lands', useAsync(authMiddleware), useAsync(roleMiddleware(['farmer'])), useAsync(GetLands));


module.exports = router;