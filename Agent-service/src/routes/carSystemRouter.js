const express = require('express');
const {AddCarToCalatog, CreateReservationFromAgency, isThisCarAvaible, listReservation, listCars} = require ('../controllers/carController');
const { validAddCarToCatalog, validCreateReservation, validIsAvailable, validIsAgent } = require('../lib/validator');

const router = express.Router();

router.post('/catalog' , validAddCarToCatalog, AddCarToCalatog);
router.get('/catalog', validIsAgent, listCars)
router.post('/reservation', validCreateReservation, CreateReservationFromAgency )
router.get('/availability', validIsAvailable, isThisCarAvaible)
router.get('/listReservation', validIsAgent, listReservation)

module.exports = {
    carSystemRouter: router
}