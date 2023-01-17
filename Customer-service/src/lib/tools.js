const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {userSchema} = require('../models/User');

const User = mongoose.model('User', userSchema);

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

module.exports = {
    isUserExistAndPasswordCorrect: isUserExistAndPasswordCorrect, 
    hashPassword: hashPassword,
    validatePassword: validatePassword
}
