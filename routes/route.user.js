const {authMiddleware} = require('../middleware/middleware.protects');

const express = require('express');
const router = express.Router();
const CoreError = require('./../core/core.error');
//load controller and utils
const { fetchUser, updateUser, updateImage} = require('./../controllers/controller.user');
/**
 * auth routes
 */
router.get('/details', authMiddleware, fetchUser);
router.patch('/update-profile', authMiddleware, updateImage);
router.put('/edit', authMiddleware, updateUser);
/**
 * Export lastly
 */
router.all('/*', (req, res) => {
    throw new CoreError(`route not found ${req.originalUrl} using ${req.method} method`, 404);
})


module.exports = router;