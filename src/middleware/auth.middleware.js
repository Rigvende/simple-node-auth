const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logger } = require('../logger.js');
const { checkToken } = require('../tokensBlackList');

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const { authorization } = req.headers;
        const token = authorization ? authorization.split(' ')[1] : null;

        if (!token) {
            logger.warn("Token unrecognized");
            throw new Error();
        }

        const { JWT_SECRET, JWT_TIME } = process.env;
        const decoded = jwt.decode(token, JWT_SECRET);

        checkToken(decoded.id, token, res);

        if (Date.now() >= decoded.exp * 1000) {
            logger.warn("Token expired");
            const user = await User.findOne(({ where: { id: decoded.id } }));
            const refreshToken = user.token;

            try {
                const verified = jwt.verify(refreshToken, JWT_SECRET);
                const newToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: JWT_TIME });
                logger.info("Token refreshed");
                req.refresh = { token: newToken, id: decoded.id };
                req.user = verified;
                next();
            } catch (err) {
                logger.warn("Refresh token expired");
                res.send401("Authorization expired");
            }
        } else {
            try {
                const verified = jwt.verify(token, JWT_SECRET);
                req.user = verified;
                req.token = token;
                next();
            } catch (err) {
                logger.error("Token damaged")
                res.send401("Authorization expired");
            }
        }
    } catch (err) {
        logger.error(`Authorization failed! ${err}`)
        res.send401();
    }
};
