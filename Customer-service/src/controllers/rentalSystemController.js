const mongoose = require('mongoose');
const { cartReservationItemSchema } = require('../models/CartReservationItem');
const { carSchema } = require('../models/Car');
const { validationResult } = require('express-validator');
const { isUserExistAndPasswordCorrect, isCarIdValid, daysBetween, isCarAvailable} = require('../lib/tools');

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
        if (typeof user !== "object") {
            res.status(400).json("User does not exist or password is incorrect");
            return false;
        }
        
        const car = await isCarIdValid(req.body.carID);
        if (typeof car !== "object") {
            res.status(400).json("Car ID is not valid");
            return false;
        }


        const availability = await isCarAvailable(req.body.carID, req.body.startDate, req.body.endDate);
        if (availability === false) {
            res.status(400).json("Car is not available on this period ");
            return false;
        };

        const inCart = await CartItem.findOne({carID: req.body.carID, userID: user._id});
        if (typeof inCart === "object") {
            res.status(400).json("Car is already in cart");
            return false;
        };
       
        const durationReservation = await daysBetween(req.body.endDate, req.body.startDate);
        if (durationReservation < 1) {
            res.status(400).json("End date must be after start date");
        }

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


/**
 * Retrieve car by option.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const retrieveSpecificCars = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    let optionList = []
    if (req.body.brand) {
        optionList.push({brand: req.body.brand});
    }
    if (req.body.model) {
        optionList.push({model: req.body.model});
    }
    if (req.body.seats) {
        optionList.push({seats: req.body.seats});
    }

    if (optionList.length == 0 || optionList == [] ) {
        res.status(400).json("No options provided or wrong options provided");
        return false;
    }

    try {
        let cars = await Car.find({$and: optionList});
        if(cars.length == 0) {
            res.status(404).json("No car found with this option");
            return false;
        }
        res.status(200).json(cars);
    } catch (err) {
        res.status(500).json("Error while retrieving this specificy on cars" + err);
    }
}

/**
 * Retrieve description of a specific Car.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getCarDescritpion = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
        const car = await isCarIdValid(req.params.carID);
        if (typeof car === "object") {
            let carDescription = {
                brand: car.brand,
                model: car.model,
                seats: car.numberOfSeat,
                pricePerDay: car.pricePerDay,
            }
            res.status(200).json(carDescription);
        } else {
            res.status(400).json("Car ID is not valid");
        }
    } catch (err) {
        res.status(500).json("Error while retrieving car description" + err);
    }
}   
  


const getCartContent = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const user = await isUserExistAndPasswordCorrect(req.body.email, req.body.password);

    if (typeof user !== "object") {
        res.status(401).json("Cannot find your account");
        return false;
    }

    // // Get all reservation for this user
    // let cart = []
    // CartItem.find({userID: user._id}, (err, cart) => {
    //     if (err) {
    //         res.status(500).json("Cannot retrieve cart : " + err);
    //     }
    //     else {
    //         res.status(200).json(cart);
    //     }
    // });
}   




  
  module.exports = {
    retrieveAllCars: retrieveAllCars,
    retrieveSpecificCars: retrieveSpecificCars,
    getCarDescritpion: getCarDescritpion,
    AddToCart: AddToCart,
    getCartContent: getCartContent,
    submitCart: submitCart
}
  
  
  