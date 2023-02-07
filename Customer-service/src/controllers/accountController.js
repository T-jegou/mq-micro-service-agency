const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { hashPassword, isUserExistAndPasswordCorrect, retrieveReservations } = require('../lib/tools');
const {userSchema} = require('../models/User');

const User = mongoose.model('User', userSchema);


/**
 * Create account.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const createAccount = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  let userInfo = req.body;
  const newUser = new User(userInfo);

  newUser.password = await hashPassword(newUser.password);

  newUser.save((err, user) => {
    if (err) {
      res.status(500).json("Cannot create your account");
    } else {
      // res.status(201).json(user._id);
      res.status(201).json("Account created");
    }
  });
}

/**
 * Get account Reservation.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getAccountReservations = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }


  const user = await isUserExistAndPasswordCorrect(req.body.email, req.body.password);

  if (typeof user !== "object") {
    res.status(401).json("Cannot find your account");
  }

  let userID = user._id;

  let Reservation = await retrieveReservations(userID);

  if (typeof Reservation === "object") {
    res.status(200).json(Reservation);
  } else {
    res.status(401).json("There is no reservation for this account");
  }
}


/**
 * Get account informations.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getAccount = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  try {
    const user = await isUserExistAndPasswordCorrect(req.body.email, req.body.password);
    if (typeof user === "object") {
      res.status(200).json(user);
    } else {
      res.status(401).json("Cannot find your account");
    }
  } catch (err) {
    res.status(401).json("Cannot find your account");
  }
};

/**
 * Update account.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateAccount = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  try {
    const user = await isUserExistAndPasswordCorrect(req.body.email, req.body.password);
    if (typeof user === "object") {
      for(const field in req.body) {
        if (field != "password" && field != "userID" && field != "email") {
          user[field] = req.body[field];
        }
      };
      user.save((err, user) => {
        if (err) {
          res.status(500).json("Cannot update your account");
        }
        else {
          res.status(200).json(user);
        }
      });
    } else {
      res.status(401).json("Cannot find your account");
    }
  } catch (err) {
    res.status(500).json("An error occured while updating your account");
  }
}


/**
 * delete account.
 * To do : delete reservation if user has one
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteAccount = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  try {
    const user = await isUserExistAndPasswordCorrect(req.body.email, req.body.password);
    if (typeof user === "object") {
      User.deleteOne({_id: user._id}, (err) => {
        if (err) {
          res.status(500).json("Cannot delete your account");
        } else {
          res.status(200).json("Account deleted");
        }
      });
    } else {
      res.status(401).json("Cannot find your account");
    }
  } catch (err) {
    res.status(401).json("An error occured while deleting your account");
  }
}





module.exports = {
    getAccountReservations: getAccountReservations,
    createAccount: createAccount,
    getAccount: getAccount,
    updateAccount: updateAccount,
    deleteAccount: deleteAccount
}


