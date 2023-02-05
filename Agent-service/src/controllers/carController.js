const { logger } = require('../services/loggerService');
const { validationResult } = require('express-validator');
const { isAgentExistAndPasswordCorrect, isCarIdValid, daysBetween, isCarAvailable, isCustomerExist, saveReservations} = require('../lib/tools');
const mongoose = require('mongoose');
const {carSchema} = require('../models/Car');
const {userSchema} = require('../models/User');
const {reservationSchema} = require('../models/Reservation');

const Car = mongoose.model('Car', carSchema);
const Customer = mongoose.model('User', userSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);


// List the catalog of cars
const listCars = async (req, res) => {
    try {
        let cars = await Car.find({});
        if (typeof cars === "object") {
            return res.status(200).json(cars);
        } else {
            logger.info("Cannot find any car in the database");
            return res.status(404).json({ errors: [{ msg: 'Cannot find any car in the database' }] });
        }
    } catch (err) {
        logger.info("Cannot find any car in the database");
        return res.status(404).json({ errors: [{ msg: 'Cannot find any car in the database' }] });
    }
}


const listReservation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const agentEmail = req.body.email;
    const password = req.body.password;
    
    // Check if the agent is registred
    try {
        let agent = await isAgentExistAndPasswordCorrect(agentEmail, password);
        if (typeof agent !== "object") {
            logger.info("Cannot find this agent in the database");
            return res.status(401).json({ errors: [{ msg: 'Cannot find this agent in the database' }] });
        }
    } catch (err) {
        logger.info("Cannot find this agent in the database");
        return res.status(401).json({ errors: [{ msg: 'Cannot find this agent in the database' }] });
    }

    // Get all the reservation
    try {
        let reservations = await Reservation.find();
        if (typeof reservations === "object") {
            return res.status(200).json(reservations);
        } else {
            logger.info("Cannot find any reservation in the database");
            return res.status(401).json({ errors: [{ msg: 'Cannot find any reservation in the database' }] });
        }
    } catch (err) {
        logger.info("Cannot find any reservation in the database");
        return res.status(401).json({ errors: [{ msg: 'Cannot find any reservation in the database' }] });
    }
}


/**
 * Add new car to the catalog
 * @param {Object} reservation - RabbitMQ reservation object.
 * */
const processReservation = async (reservation) => {
    reservationContent = JSON.parse(reservation.content.toString());
    logger.info("AMQP - New reservation received from the exchange reservations, ready to be processed");
    let customerID = reservationContent[0].userID;
    let emailInfo = [];
    let reservationList = [];

    // Check if the customer is registred
    let customer = await isCustomerExist(customerID);
    if (typeof customer !== "object") {
        // Check if the car is available
        logger.info("Cannot find this customer in the database");
        return false;
    }

    // Check if each car is available and if the carID is valid we create a new reservation
    for (let i = 0; i < reservationContent.length; i++) {
        let carID = reservationContent[i].carID;
        let car = await isCarIdValid(carID);
        if (typeof car === "object") {
            let carAvailable = await isCarAvailable(carID, reservationContent[i].startDate, reservationContent[i].endDate);
            if (carAvailable) {
                const durationReservation = await daysBetween(reservationContent[i].startDate, reservationContent[i].endDate);
                const paymentStatus = reservationContent[i].paymentMethod === "creditCard" || "cash" ? true : false;
                const paymentMethod = reservationContent[i].paymentMethod;
                let newReservation = new Reservation({
                    carID: carID,
                    userID: customer._id,
                    startDate: reservationContent[i].startDate,
                    endDate: reservationContent[i].endDate,
                    price: car.pricePerDay * durationReservation,
                    paymentStatus : paymentStatus,
                    paymentMethod : paymentMethod,
                    ReservationStatus : "Pending"
                });

                // Sace the reservation in the reservation list
                reservationList.push(newReservation);
            } else {
                logger.info("Cannot add this new reservation : Car " + carID + "not available");
            }
        } else {
            logger.info("Cannot add this new reservation : Car " + carID +" not found");
        }
    }

    // If the reservation list is empty, we cannot add the reservation
    if (reservationList.length === 0) {
        logger.info("There is an issue with the reservation : No car(s) is available");
        return false;
    } else {
        await saveReservations(reservationList);
    }


    // Save the reservation in the database
    for (let i = 0; i < reservationList.length; i++) {
        emailInfo.push({
            carID: reservationList[i].carID,
            startDate: reservationList[i].startDate,
            endDate: reservationList[i].endDate,
            availability: "Car is available and added to the reservation",
            price: reservationList[i].price
        });
    }

    // Sum the price of all the reservation
    let totalPrice = 0;
    for (let i = 0; i < reservationList.length; i++) {
        // check if the price is a number
        if (isNaN(reservationList[i].price)) {
            logger.info("There is an issue with the reservation : Price is not a number");
            return false;
        }
        totalPrice += reservationList[i].price;
    }

    // Add the total price to the email info
    emailInfo.push({
        totalPrice: totalPrice
    });

    // Email to send to the customer with the reservation details
    const email = {
        from: 'EfreiCar@info.com',
        to: customer.email,
        subject: 'EfreiCar - New reservation',
        text: 'Your reservation is confirmed',
        html: '<p>Dear ' + customer.firstName + ' ' + customer.lastName + ',</p><p>Your reservation is confirmed</p><p>Here is the details of your reservation</p><p>' + JSON.stringify(emailInfo) + '</p><p>Thank you for using EfreiCar</p>'
    };

    logger.info("New mail created and ready to be sent to the customer");
    console.log(email);

    // Send the email to the customer
    // TODO : Ici on peut ajouter un appel vers un service de mail pour envoyer le mail
    // Ou bien gérer avec un service directement dans un autre microservice (ex : nodemailer)

}

/**
 * Add new car to the catalog
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const AddCarToCalatog = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
        const agent = await isAgentExistAndPasswordCorrect(req.body.email, req.body.password);
        if (typeof agent === "object") {
            let newCarDetail = {
                brand: req.body.brand,
                model: req.body.model,
                numberOfSeat: req.body.numberOfSeat,
                pricePerDay: req.body.pricePerDay,
                available: req.body.available
            }
            const newCar = new Car(newCarDetail);
            newCar.save((err, car) => {
                if (err) {
                    res.status(500).json("Cannot add this new car : " + err);
                }
                else {
                    res.status(201).json(car);
                }
            });
        } else {
          res.status(401).json("Cannot find your agent account");
        }
    } catch (err) {
    res.status(500).json("Error while adding car to database" + err);
    }
}


/**
 * Check if a client is registred
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const CheckIfClientIsRegistred = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
        const agent = await isAgentExistAndPasswordCorrect(req.body.email, req.body.password);
        if (typeof agent === "object") {
            customerEmail = req.body.customerEmail;
            try {
                let customer = await Customer.findOne({email: customerEmail});
                if (customer) {
                    res.status(200).json(customer);
                } else {
                    res.status(401).json("Cannot find customer account with this email");
                }
            } catch (err) {
                res.status(500).json("Error while searching client to customer database" + err);
            }
        } else {
          res.status(401).json("Cannot find your agent account");
        }
    } catch (err) {
    res.status(500).json("Error while searching client to customer database" + err);
    }
}    


/**
 * Process a reservation from agency
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const CreateReservationFromAgency = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
        const agent = await isAgentExistAndPasswordCorrect(req.body.email, req.body.password);
        if (typeof agent === "object") {
            let customer = await Customer.findOne({email: req.body.customerEmail});
            if (customer) {
                const car = await isCarIdValid(req.body.carID);
                const availability = await isCarAvailable(req.body.carID, req.body.startDate, req.body.endDate);
                if (typeof car === "object") {
                    if (availability) {
                        const durationReservation = await daysBetween(req.body.endDate, req.body.startDate);
                        let newReservationDetail = {
                            userID: customer._id,
                            carID: req.body.carID,
                            startDate: req.body.startDate,
                            endDate: req.body.endDate,
                            price: car.pricePerDay * durationReservation,
                            paymentStatus : req.body.paymentStatus,
                            paymentMethod : req.body.paymentMethod,
                            ReservationStatus : req.body.ReservationStatus
                        }
                        const newReservation = new Reservation(newReservationDetail);
                        newReservation.save((err, reservation) => {
                            if (err) {
                                res.status(500).json("Cannot create new reservation : " + err);
                            }
                            else {
                                res.status(201).json(reservation);
                            }
                        });
                    } else {
                        res.status(401).json("This car is not available for this period");
                    }
                } else {
                    res.status(401).json("Cannot find this car in our catalog");
                }
            } else {
                res.status(401).json("Cannot find customer account with this email");
            }
        } else {
            res.status(401).json("Cannot find your agent account");
        }
    } catch (err) {
        res.status(500).json("Error while creating new client reservation to database" + err);
    }
}   



/**
 * Check if a is car is available at a specific period
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const isThisCarAvaible = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
        const agent = await isAgentExistAndPasswordCorrect(req.body.email, req.body.password);
        if (typeof agent === "object") {
            try {
                const car = await isCarIdValid(req.body.carID);
                const availability = await isCarAvailable(req.body.carID, req.body.startDate, req.body.endDate);
                if(typeof car === "object") {
                    if (availability) {
                        res.status(200).json("AVAILABLE - This car is available for this period");
                    } else {
                        res.status(401).json("NOT AVAILABLE - This car is not available for this period");
                    }
                } else { 
                    res.status(401).json("Cannot find this car in our catalog");
                }
            } catch (err) {
                res.status(500).json("Error while searching car availability" + err);
            }
        } else {
            res.status(401).json("Cannot find your agent account");
        }
    } catch (err) {
        res.status(500).json("Error while creating new client reservation to database" + err);
    }
}   


module.exports = {
    processReservation: processReservation,
    AddCarToCalatog: AddCarToCalatog,
    CheckIfClientIsRegistred: CheckIfClientIsRegistred,
    CreateReservationFromAgency: CreateReservationFromAgency,
    isThisCarAvaible: isThisCarAvaible, 
    listReservation: listReservation,
    listCars: listCars,
};