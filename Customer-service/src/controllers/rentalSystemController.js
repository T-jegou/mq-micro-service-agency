/**
 * Manage accout.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const retrieveAllCars = (req, res) => {
    res.send(200).json("Must be implemented");
    return true;
}

const retrieveSpecificCars = (req, res) => {
    res.send(200).json("Must be implemented");
    return true;
}

const getCarDescritpion = (req, res) => {
    res.send(200).json("Must be implemented");
    return true;
}   
  
const AddToCart = (req, res) => {
    res.send(200).json("Must be implemented");
    return true;
}   

const getCartContent = (req, res) => {
    res.send(200).json("Must be implemented");
    return true;
}   

const submitCart = (req, res) => {
    let CartDetail = req.body;
    req.exchangeServices.publishReservationToExchange(CartDetail);
    res.status(201).json(CartDetail);
}   
  
  module.exports = {
    retrieveAllCars: retrieveAllCars,
    retrieveSpecificCars: retrieveSpecificCars,
    getCarDescritpion: getCarDescritpion,
    AddToCart: AddToCart,
    getCartContent: getCartContent,
    submitCart: submitCart
}
  
  
  