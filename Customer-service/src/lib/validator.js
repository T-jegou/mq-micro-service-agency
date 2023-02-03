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
    check('email').exists(),
    check('password').exists()
]

exports.validUpdateInfosUser = [
    check('email').exists(),
    check('password').exists()
]


exports.validDeleteUser = [
    check('email').exists(),
    check('password').exists()
]

exports.validReservation = [
    check('email').exists(),
    check('password').exists(),
    check('carID').exists(),
    check('startDate').exists(),
    check('endDate').exists()
]


exports.validAddToCart = [
    check('email').exists(),
    check('password').exists(),
    check('carID').exists(),
    check('startDate').exists(),
    check('endDate').exists()
]

exports.validGetSpecificCar = [
    check('brand'),
    check('model'),
    check('seat')
]
   
exports.validGetCarDescritpion = [
    check('carID').exists()
]

exports.validDelCartItem = [
    check('email').exists(),
    check('password').exists(),
    check('reservation_id').exists()
]

exports.validGetCartContent = [
    check('email').exists(),
    check('password').exists()
]

exports.validSubmitCar = [
    check('email').exists(),
    check('password').exists()
]
