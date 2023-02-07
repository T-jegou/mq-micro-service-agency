const express = require('express');
const { validCheckCustomer } = require('../lib/validator');
const { CheckIfClientIsRegistred, retrieveReservationsOfACustomer } = require ('../controllers/carController');

const router = express.Router();

router.get('/isClient' , validCheckCustomer, CheckIfClientIsRegistred);
router.get('/reservations', validCheckCustomer, retrieveReservationsOfACustomer)


module.exports = {
    customerServiceRouter: router
}