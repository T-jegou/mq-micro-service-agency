const express = require('express');
const morgan = require('morgan');
const { errorHandlerMiddleware } = require ('./services/errorHandlingService');
const { logger } = require('./services/loggerService');
const { amqpConnect } = require('./services/amqpService');
const { mongoConnect } = require('./services/mongoService');
const { addRoutes } = require('./routes/api');


const PORT = process.env.PORT || 3000;

startServer = () => {
    // Create a new express application instance
    const app = express()

    // Connect to RabbitMQ service  
    amqpConnect()

    // Connect to MongoDB database
    mongoConnect()

    // middleware to add basic logging - Combined format is a standard Apache log output format
    app.use(morgan('combined'));

    // Middleware to parse incoming requests with JSON payloads
    app.use(express.json())

    // Handdle errors
    app.use(errorHandlerMiddleware)

    // Add router handler
    addRoutes(app)

    app.listen(PORT, () => {
        logger.info(`customer service listening on port ${PORT}`);
    })
}

module.exports = {
    startServer: startServer
}

