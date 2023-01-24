const mongoose = require('mongoose');
const { cartReservationItemSchema } = require('../models/CartReservationItem');
const { carSchema } = require('../models/Car');
const { validationResult } = require('express-validator');
const { isUserExistAndPasswordCorrect, isCarIdValid, daysBetween} = require('../lib/tools');

const CartItem = mongoose.model('CartItem', cartReservationItemSchema);
const Car = mongoose.model('Car', carSchema);

/**
 * Add new reservation to the cart.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const AddToCart = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
        const user = await isUserExistAndPasswordCorrect(req.body.email, req.body.password);
        if (typeof user === "object") {
            const car = await isCarIdValid(req.body.carID);
            if (typeof car === "object") {
                const durationReservation = await daysBetween(req.body.endDate, req.body.startDate);
                console.log(user)
                let reservationItemDetail = {
                    userID: user._id,
                    carID: req.body.carID,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    price: car.pricePerDay * durationReservation
                }
                const newReservationItem = new CartItem(reservationItemDetail);
                newReservationItem.save((err, reservation) => {
                    if (err) {
                        res.status(500).json("Cannot add to cart : " + err);
                    }
                    else {
                        res.status(201).json(reservation);
                    }
                });
            } else {
                res.status(400).json("Car ID is not valid");
            }     
        } else {
          res.status(401).json("Cannot find your account");
        }
    } catch (err) {
    res.status(500).json("Error while adding to cart" + err);
    }
}

/**
 * Valide the cart and send it to the exchange after payment.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const submitCart = (req, res) => {
    let Reservations = req.body;
    req.exchangeServices.publishReservationToExchange(CartDetail);
    res.status(201).json(CartDetail);
}

// ----------------------------
/**
 * List all existant and available cars.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const retrieveAllCars = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
        let cars = await Car.find({available: true});
        res.status(200).json(cars);
    } catch (err) {
        res.status(500).json("Error while retrieving cars" + err);
    }
}

const retrieveSpecificCars = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
        let cars = await Car.find({available: true});
        res.status(200).json(cars);
    } catch (err) {
        res.status(500).json("Error while retrieving this specificy on cars" + err);
    }
}

const getCarDescritpion = (req, res) => {
    res.send(200).json("Must be implemented");
    return true;
}   
  


const getCartContent = (req, res) => {
    res.send(200).json("Must be implemented");
    return true;
}   




  
  module.exports = {
    retrieveAllCars: retrieveAllCars,
    retrieveSpecificCars: retrieveSpecificCars,
    getCarDescritpion: getCarDescritpion,
    AddToCart: AddToCart,
    getCartContent: getCartContent,
    submitCart: submitCart
}
  
  
  