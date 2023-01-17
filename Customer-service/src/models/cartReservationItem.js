const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartReservationItemSchema = new Schema({
    carID : {
        type: String,
        required: true
    },
    userID : {
        type: String,
        required: true
    },
    startDate : {
        type: Date,
        required: true
    },
    endDate : {
        type: Date,
        required: true
    },
    // Prix total de la reservation
    price : {
        type: Number,
        required: true
    },
});


module.exports = {
    cartReservationItemSchema: cartReservationItemSchema
}
