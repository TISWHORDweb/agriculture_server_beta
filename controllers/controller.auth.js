// routes/authRoutes.js
const jwt = require('jsonwebtoken');
const User = require('../models/model.user');
const { useAsync, errorHandle, utils } = require('../core');

// User Registration
exports.authRegister = useAsync(async (req, res, next) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: req.body.email }
            ]
        });

        if (existingUser) {
            return res.status(400).send({
                error: 'User with this email already exists'
            });
        }

        // Create new user
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'farmer', // Default to farmer if no role specified
            profile: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                middleName: req.body.middleName,
                contact: req.body.contact,
                address: req.body.address
            },
            location: req.body.location
        });

        // Save user
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        // Respond with user info and token
        res.json(utils.JParser("User registered successfully", !!user, {
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            },
            token
        }));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

// User Login
exports.authLogin = useAsync(async (req, res, next) => {
    try {
        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: req.body.email },
            ]
        });

        if (!user) {
            return res.status(400).json(utils.JParser('Invalid email or password', !!user, user));
        }

        // Check password
        const isMatch = await user.comparePassword(req.body.password);

        if (!isMatch) {
            return res.status(400).json(utils.JParserd('Invalid login credentials', !!user, user ));
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        // Respond with user info and token
        res.json(utils.JParser("Welcome back", !!user, {
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                profile: user.profile
            },
            token
        }));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

// Change Password
exports.changePassword = useAsync(async (req, res, next) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        const user = await User.findOne({_id:userId}); 
       
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        console.log(isMatch)
        if (!isMatch) {
            return res.status(400).send({ error: 'Current password is incorrect' });
        }


        user.password = newPassword;
        await user.save();

        res.send({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).send({ error: error.message || 'Something went wrong' });
    }
});

