const express = require('express');
const router = express.Router(); 
const userController = require('../controllers/user-controller.js');
const {check} = require('express-validator');

// '/users' route

const registerChecks = [
    check('name', 'Name length must be between 1 and 20 symbols').notEmpty().isLength({ min: 1, max: 20 }),
    check('age', 'Incorrect age').notEmpty().isInt({ gt: 0, lt: 110 }),
    check('email', 'Invalid email').notEmpty().isEmail().isLength({min: 10, max: 255}),
    check('password', 'Password length must be between 3 and 20 symbols').notEmpty().isLength({ min: 3, max: 20 })
];

const editChecks = [
    check('name', 'Name length must be between 1 and 20 symbols').notEmpty().isLength({ min: 1, max: 20 }),
    check('age', 'Incorrect age').notEmpty().isInt({ gt: 0, lt: 110 }),
];

router.get("/", userController.findAll);

router.post("/", registerChecks, userController.add);

router.get("/:id", userController.findById);

router.post("/:id/edit", editChecks, userController.edit);

router.get("/:id/delete", userController.delete);

module.exports = router;
