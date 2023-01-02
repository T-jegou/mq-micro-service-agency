const express = require('express');
const {sayHello} = require ('../controllers/carController');

const router = express.Router();

router.get('/hello', sayHello);


module.exports = {
    carSystemRouter: router
}