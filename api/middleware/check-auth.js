const jwt = require('jsonwebtoken');
const {errorResponse} = require('../helpers/responseHelpers');

module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, system.env.JWT_KEY);
        request.userData = decoded;
        next();
    } catch (error) {
        errorResponse(response, request, "Auth Failed", 401);
    }
}