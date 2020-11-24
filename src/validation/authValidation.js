const { EMAIL_CHECK, PASSWORD_CHECK } = require('./validationChecks.js');

exports.loginValidation = [EMAIL_CHECK, PASSWORD_CHECK];
