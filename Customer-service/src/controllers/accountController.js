const mongoose = require('mongoose');
const { hashPassword, validatePassword } = require('../lib/tools');
const {userSchema} = require('../models/User');

const User = mongoose.model('User', userSchema);
/**
 * Manage accout.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const createAccount = async (req, res, next) => {
  let userInfo = req.body;
  const newUser = new User(userInfo);

  newUser.password = await hashPassword(newUser.password);

  newUser.save((err, user) => {
    if (err) {
        // forward to express error handling middleware
        return next(err);
    }

    res.status(201).json(user._id);
  });
}

const getAccount = (req, res) => {

  User.findById(req.body.userID, async (err, user) => {
    if (err) {
        res.status(500).json("Cannot find your account");
    } else {
      if (await validatePassword(req.body.password, user.password)) {  
        res.status(200).json(user);
      } else {
        res.status(401).json("Unauthorized");
      }
    }
  });
}

const updateAccount = (req, res) => {
  console.log("updateAccount");
  res.send("updateAccount")
  return true;
}   

const deleteAccount = (req, res) => {
    console.log("deleteAccount");
    res.send("deleteAccount")
    return true;
}

const getReservation = (req, res) => {
    console.log("getReservation");
    res.send("getReservation") 
    return true;
}

const getReservations = (req, res) => {
    console.log("getReservations");
    res.send("getReservations") 
    return true;
}


module.exports = {
    getReservations: getReservations,
    getReservation: getReservation,
    createAccount: createAccount,
    getAccount: getAccount,
    updateAccount: updateAccount,
    deleteAccount: deleteAccount
}


