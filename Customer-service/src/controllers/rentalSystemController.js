/**
 * Manage accout.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const retrieveAllCars = (req, res) => {
    console.log("retrieveAllCar");
    res.send("retrieveAllCar")
    return true;
}

const retrieveSpecificCars = (req, res) => {
    console.log("getAccount");
    res.send("getAccount")
    return true;
}

const getCarDescritpion = (req, res) => {
    console.log("updateAccount");
    res.send("updateAccount")
    return true;
}   
  
const AddToCart = (req, res) => {
    console.log("deleteAccount");
    res.send("deleteAccount")
    return true;
}   

const getCartContent = (req, res) => {
    console.log("deleteAccount");
    res.send("deleteAccount")
    return true;
}   

const submitCart = (req, res) => {
    console.log("deleteAccount");
    res.send("deleteAccount")
    return true;
}   
  
  module.exports = {
    retrieveAllCars: retrieveAllCars,
    retrieveSpecificCars: retrieveSpecificCars,
    getCarDescritpion: getCarDescritpion,
    AddToCart: AddToCart,
    getCartContent: getCartContent,
    submitCart: submitCart
}
  
  
  