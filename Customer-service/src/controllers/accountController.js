/**
 * Manage accout.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const createAccount = (req, res) => {
  console.log("createAccount");
  res.send("createAccount")
  return true;
}

const getAccount = (req, res) => {
  console.log("getAccount");
  var userID  = req.body.userID;
  console.log(userID);
  res.send("getAccount")
  req.Object
  return true;
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


