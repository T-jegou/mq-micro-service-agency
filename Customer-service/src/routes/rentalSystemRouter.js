const express = require('express');
const {retrieveAllCars, retrieveSpecificCars, getCarDescritpion, AddToCart, getCartContent, submitCart} = require ('../controllers/rentalSystemController');

const router = express.Router();

router.get('/allCars', retrieveAllCars);
router.get('/specificCars', retrieveSpecificCars);
router.get('/carDescription/:carID', getCarDescritpion);
router.post('/addToCart', AddToCart);
router.get('/cartContent', getCartContent);
router.post('/submitCart', submitCart);

module.exports = {
    rentalSystemRouter: router 
}