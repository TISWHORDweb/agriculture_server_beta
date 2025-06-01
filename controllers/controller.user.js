const { useAsync, errorHandle, utils } = require('../core');
const User = require('../models/model.user');


// Get Current User Profile
exports.fetchUser = useAsync(async (req, res, next) => {
    try {
        // Exclude password from the returned user object
        const user = await User.findById(req.user._id)
            .select('-password')
User.updateMany({"status": true}, {"$set": { "image": "" }})  
            res.json(utils.JParser("ok-response", !!user, user));
    } catch (error) {
        throw new errorHandle(e.message, 500);
    }
});

// Update User Profile
exports.updateUser = useAsync(async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['profile', 'email', 'contact'];

    const isValidOperation = updates.every(update =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const user = req.user;

        // Update allowed fields
        if (req.body.profile) {
            user.profile = { ...user.profile, ...req.body.profile };
        }

        if (req.body.email) user.email = req.body.email;

        await user.save();

        res.send({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                profile: user.profile
            }
        });
    } catch (error) {
        throw new errorHandle(e.message, 500);
    }
});

exports.updateImage = useAsync(async (req, res, next) => {
    try {
        const request = await User.findByIdAndUpdate(
            req.user._id,
            {
                image: req.body.image,
            },
            { new: true }
        );

        if (!request) {
            return res.status(404).send({ error: 'Request not found' });
        }

        res.json(utils.JParser("Profile pics updated successfully", !!request, request));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});