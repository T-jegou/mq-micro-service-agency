const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {userSchema} = require('../models/User');
const {carSchema} = require('../models/Car');
const { carItemSchema } = require('../models/cartReservationItem');

const Car = mongoose.model('Car', carSchema);
const User = mongoose.model('User', userSchema);
const CartItem = mongoose.model('CartItem', carItemSchema);

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};


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

async function isCarIdValid(carID) {
  try {
    let car = await Car.findById(carID);
    if (typeof car === "object") {
      console.log(car);
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

  console.log(typeof(diffDays));
  return diffDays;
}

module.exports = {
  daysBetween: daysBetween,
  isCarIdValid: isCarIdValid,
  isUserExistAndPasswordCorrect: isUserExistAndPasswordCorrect, 
  hashPassword: hashPassword,
  validatePassword: validatePassword,
  cleanCart: cleanCart
}
