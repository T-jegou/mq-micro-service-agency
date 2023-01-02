const {carSystemRouter} = require('./carSystemRouter');

const addRoutes = (app) => {
    app.use('/api/car', carSystemRouter);
}

module.exports = {
    addRoutes: addRoutes
}