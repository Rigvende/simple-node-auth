require('dotenv').config();
const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { logger } = require('../logger.js');
const { invalidateToken } = require('../tokensBlackList');
const mail = require('./mailController');

const { JWT_SECRET, JWT_TIME, JWT_REFRESH_TIME, JWT_REMEMBER_TIME } = process.env;

exports.getMainPage = (req, res) =>
    res.send(`<h1>Hello from Simple-Node-Auth!</h1>`);

exports.login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
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

        const refreshToken = rememberMe
            ? jwt.sign({ id }, JWT_SECRET, { expiresIn: Number(JWT_REMEMBER_TIME) })
            : jwt.sign({ id }, JWT_SECRET, { expiresIn: Number(JWT_REFRESH_TIME) });
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
        const checkedUser = await User.findOne({ where: { id: user.id } });
        const refreshToken = checkedUser.token;
        const decoded = jwt.decode(refreshToken, JWT_SECRET);
        const time = parseInt((decoded.exp * 1000 - Date.now()) / 1000);

        await invalidateToken(user.id, token, time);
        logger.info('Logout successful');
        return res.send200();
    } catch (err) {
        logger.error(`Logout failed! ${err}`);
        return res.send500();
    }
};

exports.resetPassword = async (req, res) => {
    const { email } = req;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            logger.warn("Invalid email");
            return res.send401("Invalid email");
        }

        await mail.sendResetPasswordEmail(user);
        logger.info('Mail sent successful');
        return res.send200();
    } catch (err) {
        logger.error(`Mail sending failed! ${err}`);
        return res.send500();
    }
};

exports.changePassword = async (req, res) => {
    const { password, email } = req;
    const { id } = req.params;
    try {
        const user = await User.findOne({ where: { id, email } });  
        
        if (!user) {
            logger.warn("Invalid id/email");
            return res.send401("User not found");
        }

        await User.update({ password }, { where: { id } });
        logger.info('Passport reset successful');
        return res.send200();
    } catch (err) {
        logger.error(`Passport reset failed! ${err}`);
        return res.send500();
    }
};
