// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/model.user');
const { errorHandle } = require('../core');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findOne({ 
      _id: decoded.userId, 
      'tokens.token': token 
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ error: 'Access denied' });
    }
    next();
  };
};

const bodyParser =  (req, res, next) => {
    Promise.resolve().then(() => {
        if (!Object.keys(req.body).length > 0) throw new errorHandle("the document body is empty", 202);
        else next();
    }).catch(next)
}

module.exports = {
  authMiddleware,
  roleMiddleware,
  bodyParser
};