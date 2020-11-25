const { NAME_CHECK, AGE_CHECK, EMAIL_CHECK, PASSWORD_CHECK }
    = require('./validationChecks.js');

exports.registrationValidation = [NAME_CHECK, AGE_CHECK, EMAIL_CHECK, PASSWORD_CHECK];

exports.updateValidation = [NAME_CHECK, AGE_CHECK];
