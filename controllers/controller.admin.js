// routes/adminRoutes.js
const User = require('../models/model.user');
const Land = require('../models/model.land');
const SoilTestRequest = require('../models/model.request');
const SoilTestResult = require('../models/model.result');
const SoilData = require('../models/model.tests');
const { useAsync, errorHandle, utils } = require('../core');

// Get all users by role
exports.users = useAsync(async (req, res, next) => {
    try {
        const users = await User.find({ role: req.params.role })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(utils.JParser("ok-response", !!users, users));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

exports.GetUserDetails = useAsync(async (req, res, next) => {
    try {
        const requests = await User.findOne({
            _id: req.user._id
        })
            .populate('soilTestRequests');

        res.json(utils.JParser("ok-response", !!requests, requests));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

// Get all soil test requests with advanced filtering
exports.testRequests = useAsync(async (req, res, next) => {
    try {
        const { status, fromDate, toDate } = req.query;

        const query = {};

        if (status) query.status = status;
        if (fromDate || toDate) {
            query.requestDate = {};
            if (fromDate) query.requestDate.$gte = new Date(fromDate);
            if (toDate) query.requestDate.$lte = new Date(toDate);
        }

        const requests = await SoilTestRequest.find(query)
            .populate('farmer', 'profile email')
            .populate('agent', 'profile email')
            .populate('land', 'name location')
            .sort({ requestDate: -1 });

        res.json(utils.JParser("ok-response", !!requests, requests));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

exports.singleTestRequests = useAsync(async (req, res, next) => {
    try {

        const requests = await SoilTestRequest.findOne({ _id: req.params.id })
            .populate('farmer', 'profile email')
            .populate('agent', 'profile email')
            .populate('land', 'name location')
            .sort({ requestDate: -1 });

        res.json(utils.JParser("ok-response", !!requests, requests));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});


exports.AllResult = useAsync(async (req, res, next) => {
    try {
        const requests = await SoilTestResult.find()
            .populate({
                path: 'request',
                populate: [
                    { path: 'land', model: 'Land' },
                    { path: 'farmer', model: 'User', select: 'name profile' }
                ]
            })
            .populate('agent')

        const recommendations = await CropFertilizerModel.find({ resultId: requests._id });

        res.json(utils.JParser("ok-response", !!requests, { requests, recommendations }));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

// Delete a user
exports.deleteUser = useAsync(async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Optional: Clean up related data
        await Land.deleteMany({ farmer: user._id });
        await SoilTestRequest.deleteMany({
            $or: [
                { farmer: user._id },
                { agent: user._id }
            ]
        });

        res.json(utils.JParser("User and related data deleted successfully", true, []));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

// Get detailed analytics
exports.analytics = useAsync(async (req, res, next) => {
    try {
        const [
            totalUsers,
            usersByRole,
            totalLands,
            totalRequests,
            requestsByStatus
        ] = await Promise.all([
            User.countDocuments(),
            User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } }
            ]),
            Land.countDocuments(),
            SoilTestRequest.countDocuments(),
            SoilTestRequest.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ])
        ]);
        res.json(utils.JParser("ok-response", true, {
            totalUsers,
            usersByRole,
            totalLands,
            totalRequests,
            requestsByStatus
        }));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

exports.saveSoilData = useAsync(async (req, res, next) => {
    try {
        const { soilData } = req.body;
        
        if (!Array.isArray(soilData)) {
            throw new Error('Invalid data format');
        }

        // Create the soil data records
        const createdSoilData = await SoilData.create(soilData);
        
        res.json(utils.JParser("ok-response", true, createdSoilData));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});


exports.getSoilData = useAsync(async (req, res, next) => {
    try {
        // Fetch all soil data from the database
        const soilData = await SoilData.find();

        res.json(utils.JParser("ok-response", !!soilData, soilData));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});

exports.getSingleSoilData = useAsync(async (req, res, next) => {
    try {
        // Fetch all soil data from the database
        const soilData = await SoilData.find({ _id: req.params.id });

        res.json(utils.JParser("ok-response", !!soilData, soilData));
    } catch (error) {
        throw new errorHandle(error.message, 500);
    }
});


// exports.adminStats = useAsync(async (req, res, next) => {
//     try {
//         //create data if all data available
//         const schema = Joi.object({
//             email: Joi.string().email({minDomainSegments: 2}).required(),
//         })
//         //capture user data
//         const {email} = req.body;
//         //validate user
//         const validator = await schema.validateAsync({email});
//         //hash password before checking
//         const newPass = utils.AsciiCodes(8);
//         const user = await ModelUser.findOne({where: validator});
//         if (user) {
//             const uuser = user.update({password: sha1(newPass), token: sha1(user.email + new Date().toUTCString)});
//             if (uuser) {
//                 /**
//                  * Change email template before productions
//                  */
//                 new emailTemple(user.email)
//                     .who(user.fullname)
//                     .body("You requested for a password reset<br/>" +
//                         "A new password has been generated for you, do login and change it immediately" +
//                         "<h1 style='margin-top: 10px; margin-bottom: 10px;'>" +newPass+"</h1>"+
//                         "Check out our new courses.")
//                     .subject(etpl.PasswordReset).send().then(r => console.log(r));
//             }
//         }
//         res.json(utils.JParser("ok-response", !!user, user));
//     } catch (error) {
//         throw new errorHandle(error.message, 202);
//     }
// });
