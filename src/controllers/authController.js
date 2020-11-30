require('dotenv').config();
const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_TIME, JWT_REFRESH_TIME } = process.env;

exports.getMainPage = (req, res) =>
    res.send(`<h1>Hello from Simple-Node-Auth!</h1>`);

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            return res.send400(res, errors, "Incorrect login data");
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.send401(res, "Invalid email/password");
        }

        const { id } = user;
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
            return res.send401(res, "Invalid email/password");
        }

        const refreshToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: Number(JWT_REFRESH_TIME) });
        const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: Number(JWT_TIME) });
        await User.update({ token: refreshToken }, { where: { id } });
        return res.json({ token, id });          
    } catch (err) {
        console.log(err)
        res.send500(res);
    }
};
