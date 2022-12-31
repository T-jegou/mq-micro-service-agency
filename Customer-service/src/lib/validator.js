const { check } = require('express-validator');

exports.validUserCreation = [
    check('name').exists(),
    check('surname').exists(),
    check('email').isEmail(),
    check('password').isLength({ min: 5 }),
    check('address').exists(),
    check('city').exists(),
    check('zipCode').isNumeric().exists(),
    check('country').exists()
]

exports.validGetInfosUser = [
    check('userID').exists(),
    check('password').exists()
]

exports.validUpdateInfosUser = [
    check('userID').exists(),
    check('password').exists()
]