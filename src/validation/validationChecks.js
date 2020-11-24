const { check } = require('express-validator');

exports.NAME_CHECK = check('name', 'Name length must be between 1 and 20 symbols')
    .notEmpty().isLength({ min: 1, max: 20 });

exports.AGE_CHECK = check('age', 'Incorrect age')
    .notEmpty().isInt({ gt: 0, lt: 110 });

exports.EMAIL_CHECK = check('email', 'Invalid email')
    .notEmpty().isEmail().isLength({ min: 10, max: 255 });

exports.PASSWORD_CHECK = check('password', 'Password length must be between 3 and 20 symbols')
    .notEmpty().isLength({ min: 3, max: 20 });
