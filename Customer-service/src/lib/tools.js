const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}


async function validatePassword(password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
}

async function isUserExistAndPasswordCorrect(email, password) {
    User.findById(email, async (err, user) => {
        if (err) {
            return false
        } else {
          if (await validatePassword(password, user.password))  { 
            return user;
          } else {
            return false
          }
        }
      });
}

module.exports = {
    isUserExistAndPasswordCorrect: isUserExistAndPasswordCorrect, 
    hashPassword: hashPassword,
    validatePassword: validatePassword
}
