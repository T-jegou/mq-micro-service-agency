const express = require('express');
const { getAccountReservations, createAccount, getAccount, updateAccount, deleteAccount} = require('../controllers/accountController');
const {validUserCreation, validGetInfosUser, validUpdateInfosUser, validDeleteUser} = require('../lib/validator');

const router = express.Router();

router.post('/create' , validUserCreation, createAccount);
router.get('/infos', validGetInfosUser,getAccount);
router.put('/update', validUpdateInfosUser, updateAccount);
router.delete('/delete', validDeleteUser, deleteAccount);
router.get('/reservations', validGetInfosUser, getAccountReservations);


module.exports = {
    accountRouter: router
}