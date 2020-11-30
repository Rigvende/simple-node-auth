require('dotenv').config();
const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { logger } = require('../logger');

const { JWT_SECRET, JWT_TIME, JWT_REFRESH_SECRET, JWT_REFRESH_TIME } = process.env;

exports.getMainPage = (req, res) =>
    res.send(`<h1>Hello from Simple-Node-Auth!</h1>`);

exports.login = async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            send400(res, errors, "Incorrect login data");
        } else {          
            const { email, password } = req.body;      
            const user = await User.findOne({ where: { email } });
                            
            if (user) {
                const { id } = user;
                const isMatch = await bcrypt.compare(password, user.password);
         
                if (!isMatch) {
                    send401(res, "Invalid email/password");
                }

                const refreshToken = jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: +JWT_REFRESH_TIME });
                await User.update({ token: refreshToken }, { where: { id} });
           
                const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: +JWT_TIME });
                res.json({ token, id });          
            } else {
                send401(res, "Invalid email/password");
            }
        }
    } catch (err) {
        console.log(err);
        send500(res);
    }
};
