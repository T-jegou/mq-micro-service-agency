const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {userSchema} = require('../models/User');
const {carSchema} = require('../models/Car');
const {cartItemSchema} = require('../models/CartItem');

const Car = mongoose.model('Car', carSchema);
const User = mongoose.model('User', userSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);
const Reservation = mongoose.model('Reservation', cartItemSchema);

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

async function retrieveReservations(userID) {

  try {
    console.log(userID);
    let reservations  = await Reservation.find({userID: userID});
    // If no reservation found
    console.log(reservations);
    if (reservations.length === 0) {
      return false;
    } else {
      return reservations;
    }  
  } catch (err) {
    res.status(500).json("An error occured while getting your reservations");
  }
  
}


async function validatePassword(password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
};

async function isUserExistAndPasswordCorrect(userEmail, password) {
  try {
    let user = await User.findOne({email: userEmail});
    if (typeof user === "object") {
      if (await validatePassword(password, user.password)) {
        return user;
      } else {
        return false
      }
    } else {
      return false
    }
  } catch (err) {
    return false
  }

};

async function cleanCart() {
  try {
    await CartItem.deleteMany({});
  } catch (err) {
    console.log(err);
  }
}

async function cleanCustomer() {
  try {
    await User.deleteMany({});
  } catch (err) {
    console.log(err);
  }
}

async function isCarIdValid(carID) {
  try {
    let car = await Car.findById(carID);
    if (typeof car === "object") {
      return car;
    } else {
      return false
    }
  } catch (err) {
    return false
  }
};

async function daysBetween(date1, date2) {
  // Convertir les dates en millisecondes
  var date1Time = new Date(date1).getTime();
  var date2Time = new Date(date2).getTime();

  // Calculer la différence en millisecondes
  var timeDiff = Math.abs(date2Time - date1Time);

  // Convertir la différence en jours
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return diffDays;
}

async function isCarAvailable(carID, startDate, endDate) {
  newResStartDate = new Date(startDate);
  newResEndDate = new Date(endDate);

  try {
    newCar = await Car.findById(carID);
      if (typeof newCar !== "object") {
          return false;
      }
      if (newCar.available !== true) {
          return false;
      }

      let reservation = await Reservation.find({carID: carID});
      if (reservation.length === 0) {
          return true;
      }
      for (let i = 0; i < reservation.length; i++) {
          if ((newResStartDate >= reservation[i].startDate && newResStartDate <= reservation[i].endDate)
              || (newResEndDate >= reservation[i].startDate && newResEndDate <= reservation[i].endDate)
              || (newResStartDate <= reservation[i].startDate && newResEndDate >= reservation[i].endDate)) {
              return false;
          } 
      }   
      return true;
  } catch (err) {
      console.log(err);
      return false;
  }
}

module.exports = {
  daysBetween: daysBetween,
  isCarIdValid: isCarIdValid,
  isUserExistAndPasswordCorrect: isUserExistAndPasswordCorrect, 
  hashPassword: hashPassword,
  validatePassword: validatePassword,
  cleanCart: cleanCart,
  isCarAvailable: isCarAvailable, 
  retrieveReservations: retrieveReservations,
  cleanCustomer: cleanCustomer
}
