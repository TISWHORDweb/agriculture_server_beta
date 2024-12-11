let express = require('express');
let router = express.Router();
let {errorHandle, useAsync} = require('../core');
//load middleware for admin
let {authMiddleware, roleMiddleware} = require('../middleware/middleware.protects');
//load controller for admin
let {testRequests,users,deleteUser,analytics} = require('../controllers/controller.admin');

/* GET statistics data. */
router.get('/users', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(users));
router.get('/test-request', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(testRequests));
router.delete('/delete-user', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(deleteUser));
router.get('/analytics', useAsync(authMiddleware), useAsync(roleMiddleware(['admin'])), useAsync(analytics));


module.exports = router;