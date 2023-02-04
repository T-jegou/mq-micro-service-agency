const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { isUserExistAndPasswordCorrect, isCarIdValid, daysBetween, isCarAvailable} = require('../lib/tools');

const { cartItemSchema } = require("../models/CartItem");
const { carSchema } = require('../models/Car');
const CartItem = mongoose.model('CartItem', cartItemSchema);
const Car = mongoose.model('Car', carSchema);

/**
 * Valide the cart and send it to the exchange after payment.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const submitCart = async (req, res) => {
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
        const reservationList = await CartItem.find({userID: user._id});
        if (reservationList.length === 0) {
            res.status(400).json("Cart is empty");
            return false;
        }

        const paymentMethodRes = req.body.paymentMethod;
        if (paymentMethodRes !== "cash" && paymentMethodRes !== "creditCard") {
            res.status(400).json("Payment method is not valid");
            return false;
        }

        // If paymentMethod is creditCard, check if creditCardNumber field is present
        if (paymentMethodRes === "creditCard") {
            if (typeof req.body.creditCardNumber === "undefined") {
                res.status(400).json("Credit card number is not valid, it must be 16 digits. Cart not submitted");
                return false;
            }
        }

        // If paymentMethod is creditCard, check if creditCardNumber is valid
        if (paymentMethodRes === "creditCard") {
            const creditCardNumber = req.body.creditCardNumber;
            if (creditCardNumber.length !== 16) {
                res.status(400).json("Credit card number is not valid, it must be 16 digits. Cart not submitted");
                return false;
            }
        }

        // Cast reservationList to JSON
        const reservationListJSON = JSON.parse(JSON.stringify(reservationList));


        // Add field paymentMethod to each items in reservationList
        for (let i = 0; i < reservationListJSON.length; i++) {
            reservationListJSON[i].paymentMethod = paymentMethodRes;
        }

        // Place reservationList to exchange
        req.exchangeServices.publishReservationToExchange(reservationListJSON);

        // Delete cart
        await CartItem.deleteMany({userID: user._id});


        res.status(201).json("Cart submitted");
        return true;
    } catch (err) {
        res.status(500).json("Error while submitting cart" + err);
    }
}


/**
 * Submit cartItem to process.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *  
 * @returns {Object} - CartItem object.
 * @returns {Object} - Error object.
 */

const testMQ = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    jsonPayload = [
        {
            "carID": "5f1f1b9b9b9b9b9b9b9b9b9b",
            "startDate": "2020-07-20",
            "endDate": "2020-07-25",
            "userID": "5f1f1b9b9b9b9b9b9b9b9b9b"
        },
        {
            "carID": "5f1f1b9b9b9b9b9b9b9b9b9b",
            "startDate": "2020-07-20",
            "endDate": "2020-07-25",
            "userID": "5f1f1b9b9b9b9b9b9b9b9b9b"
        }
    ]
    req.exchangeServices.publishReservationToExchange(jsonPayload);
    res.status(201).json("Cart submitted");
    return true;
}


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

        // Is this reservation already in the cart
        const inCart = await CartItem.findOne({carID: req.body.carID, userID: user._id});
        if (inCart !== null) {
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
  

/**
 * Retrieve content of your Cart.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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

    CartDetail = await CartItem.find({userID: user._id});

    if (CartDetail.length == 0) {
        res.status(404).json("No car in cart");
        return false;
    }

    res.status(200).json(CartDetail);
}


/**
 * Delete a reservation in your cart.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteReservationInCart = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    const user = await isUserExistAndPasswordCorrect(req.body.email, req.body.password);
    if (typeof user !== "object") {
        res.status(401).json("Cannot find your account");
        return false;
    }
    
    try {
        const cartItemDetail = await CartItem.deleteOne({_id: req.body.reservation_id, userID: user._id});
        if (cartItemDetail.deletedCount == 0) {
            res.status(404).json("Reservation not found");
            return false;
        } else {
            res.status(200).json("Reservation deleted");
        }
    } catch (err) {
        res.status(500).json("Error while deleting reservation" + err);
        return false;
    }
}

  module.exports = {
    retrieveAllCars: retrieveAllCars,
    retrieveSpecificCars: retrieveSpecificCars,
    getCarDescritpion: getCarDescritpion,
    AddToCart: AddToCart,
    getCartContent: getCartContent,
    submitCart: submitCart,
    deleteReservationInCart: deleteReservationInCart,
    testMQ: testMQ,
}
  
  
  