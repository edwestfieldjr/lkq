const JSONWebToken = require('jsonwebtoken')
const HttpError = require('../util/http-error')

module.exports = (req, res, next) => {
    console.log("req.method ::: "+req.method)
    if (req.method === 'OPTIONS') {
        return next(); 
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        if (!token) {
            throw new Error("Auth failed", 401);
        };
        const decodedToken = JSONWebToken.verify(token, process.env.SECRET);
        req.userData = { userId: decodedToken.userId }
        console.log("req.userData inside check-auth ::: " + req.userData);
        return next();

    } catch (error) {
        return next(new HttpError(error, 401))

    }
};