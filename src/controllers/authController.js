require('dotenv').config();
const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getMainPage = (req, res) =>
    res.send(`<h1>Hello from authentication-trainee!</h1>`);

exports.login = async (req, res) => {
    try {
        console.log(req.body);
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            send400(res, errors, "Incorrect login data");
        } else {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    send401(res);
                }

                const { id } = user;
                const { JWT_SECRET } = process.env;
                const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });
                res.json({ token, id, message: `User ${id} successfully logged in` });
            } else {
                send401(res);
            }
        }
    } catch (err) {
        send500(res);
    }
};
