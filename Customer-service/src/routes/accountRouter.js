const express = require('express');
const {getReservations ,getReservation, createAccount, getAccount, updateAccount, deleteAccount} = require('../controllers/accountController');

const router = express.Router();

router.post('/create', createAccount);
router.get('/infos', getAccount);
router.put('/update', updateAccount);
router.post('/delete', deleteAccount);
router.get('/reservation/:reservationID', getReservation);
router.get('/reservations', getReservations);


module.exports = {
    accountRouter: router
}