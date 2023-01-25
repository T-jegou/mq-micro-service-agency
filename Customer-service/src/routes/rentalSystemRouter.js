const express = require('express');
const {retrieveAllCars, retrieveSpecificCars, getCarDescritpion} = require ('../controllers/rentalSystemController');
const {validGetSpecificCar, validGetCarDescritpion} = require('../lib/validator');
const router = express.Router();


router.get('/', retrieveAllCars);
router.get('/specificCars', validGetSpecificCar, retrieveSpecificCars);
router.get('/:carID',validGetCarDescritpion , getCarDescritpion);



module.exports = {
    rentalSystemRouter: router 
}