const JSONWebToken = require('jsonwebtoken')
const HttpError = require('../util/http-error')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next(); 
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        if (!token) {
            throw new Error("Auth failed", 401);
        };
        const decodedToken = JSONWebToken.verify(token, process.env.JWT_SECRET);
        req.userData = { userId: decodedToken.userId }
        return next();

    } catch (error) {
        console.log('!!!!!!!!');
        return next(new HttpError(error, 401))

    }
};