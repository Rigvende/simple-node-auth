const jwt = require('jsonwebtoken');
const { send401 } = require('../responseCodesHandler');
require('dotenv').config();

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            send401(res);
        }
        
        const { JWT_SECRET } = process.env;
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        send401(res);
    }
};
