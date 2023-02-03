const express = require('express');
const {AddToCart, getCartContent, submitCart, deleteReservationInCart, testMQ} = require ('../controllers/rentalSystemController');
const {validAddToCart, validDelCartItem, validGetCartContent, validSubmitCar} = require('../lib/validator');
const router = express.Router();

router.post('/',validAddToCart, AddToCart);
router.delete('/', validDelCartItem, deleteReservationInCart);
router.get('/', validGetCartContent, getCartContent);
router.post('/submit', validSubmitCar, submitCart);
// router.get('/test', testMQ);

module.exports = {
    cartRouter: router
}