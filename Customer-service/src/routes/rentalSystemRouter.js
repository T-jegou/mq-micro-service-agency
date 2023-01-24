const express = require('express');
const {retrieveAllCars, retrieveSpecificCars, getCarDescritpion, AddToCart, getCartContent, submitCart} = require ('../controllers/rentalSystemController');
const {validAddToCart, validGetSpecificCar, validGetCarDescritpion} = require('../lib/validator');
const router = express.Router();

router.get('/', retrieveAllCars);
router.get('/specificCars', validGetSpecificCar, retrieveSpecificCars);
router.get('/:carID',validGetCarDescritpion , getCarDescritpion);
router.post('/addToCart',validAddToCart,  AddToCart);
router.get('/cartContent', getCartContent);
router.post('/submitCart', submitCart);

module.exports = {
    rentalSystemRouter: router 
}