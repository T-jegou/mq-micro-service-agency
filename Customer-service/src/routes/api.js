const {accountRouter} = require('./accountRouter');
const {rentalSystemRouter} = require('./rentalSystemRouter');
const {cartRouter} = require('./cartRouter');

const addRoutes = (app) => {
    app.use('/api/account', accountRouter);
    app.use('/api/rentalSystem', rentalSystemRouter);
    app.use('/api/cart', cartRouter);
}

module.exports = {
    addRoutes: addRoutes
}