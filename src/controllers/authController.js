const User = require('../models/User');
const handler = require('../responseCodesHandler.js');
const { validationResult } = require('express-validator');

exports.getMainPage = (req, res) =>
    res.send(`<h1>Hello from authentication-trainee!</h1>`);

exports.login = async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            handler.send400(res, errors, "Incorrect login data");
        } else {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email, password } });
            if (user) {
                handler.send200(res, { message: `User ${user.id} successfully logged in` });
            } else {
                handler.send401(res);
            }
        }
    } catch (err) {
        handler.send500(res);
    }
};
