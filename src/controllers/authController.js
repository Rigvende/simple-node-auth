require('dotenv').config();
const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { logger } = require('../logger.js');
const { invalidateToken } = require('../tokensBlackList');

const { JWT_SECRET, JWT_TIME, JWT_REFRESH_TIME } = process.env;

exports.getMainPage = (req, res) =>
    res.send(`<h1>Hello from Simple-Node-Auth!</h1>`);

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            logger.warn("Incorrect login data");
            return res.send400(errors, "Incorrect login data")
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            logger.warn("Invalid email/password");
            return res.send401("Invalid email/password");
        }

        const { id } = user;
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            logger.warn("Invalid email/password");
            return res.send401("Invalid email/password");
        }

        const refreshToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: Number(JWT_REFRESH_TIME) });
        const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: Number(JWT_TIME) });

        await User.update({ token: refreshToken }, { where: { id } });
        logger.info('Login successful');
        return res.json({ token, id });
    } catch (err) {
        logger.error(`Authorization failed! ${err}`);
        return res.send500();
    }
};

exports.logout = async (req, res) => {
    const { token, user } = req;
    try {
        await invalidateToken(user.id, token);
        logger.info('Logout successful');
        return res.send200();
    } catch (err) {
        logger.error(`Logout failed! ${err}`);
        return res.send500();
    }
};
