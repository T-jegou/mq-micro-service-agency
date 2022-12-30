const {accountRouter} = require('./accountRouter');
const {rentalSystemRouter} = require('./rentalSystemRouter');

const addRoutes = (app) => {
    app.use('/api/account', accountRouter);
    app.use('/api/rentalSystem', rentalSystemRouter);
}

module.exports = {
    addRoutes: addRoutes
}