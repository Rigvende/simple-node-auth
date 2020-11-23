const {check} = require('express-validator');

exports.registerChecks = [
    check('name', 'Name length must be between 1 and 20 symbols').notEmpty().isLength({ min: 1, max: 20 }),
    check('age', 'Incorrect age').notEmpty().isInt({ gt: 0, lt: 110 }),
    check('email', 'Invalid email').notEmpty().isEmail().isLength({min: 10, max: 255}),
    check('password', 'Password length must be between 3 and 20 symbols').notEmpty().isLength({ min: 3, max: 20 })
];

exports.editChecks = [
    check('name', 'Name length must be between 1 and 20 symbols').notEmpty().isLength({ min: 1, max: 20 }),
    check('age', 'Incorrect age').notEmpty().isInt({ gt: 0, lt: 110 }),
];

exports.loginChecks = [
    check('email', 'Invalid email').isEmail().isLength({min: 10, max: 255}),
    check('password', 'Invalid passport length').isLength({ min: 3, max: 20 })
];