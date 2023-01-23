const express = require('express');
const {AddCarToCalatog, CreateReservationFromAgency, isThisCarAvaible} = require ('../controllers/carController');
const { validAddCarToCatalog, validCreateReservation, validIsAvailable } = require('../lib/validator');

const router = express.Router();

router.post('/catalog' , validAddCarToCatalog, AddCarToCalatog);
router.post('/reservation', validCreateReservation, CreateReservationFromAgency )
router.get('/availability', validIsAvailable, isThisCarAvaible)

module.exports = {
    carSystemRouter: router
}