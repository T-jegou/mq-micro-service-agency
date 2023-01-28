const express = require('express');
const {AddToCart, getCartContent, submitCart, deleteReservationInCart} = require ('../controllers/rentalSystemController');
const {validAddToCart, validDelCartItem, validGetCartContent} = require('../lib/validator');
const router = express.Router();

router.post('/',validAddToCart, AddToCart);
router.delete('/', validDelCartItem, deleteReservationInCart);
router.get('/', validGetCartContent, getCartContent);
router.put('/', submitCart);

module.exports = {
    cartRouter: router
}