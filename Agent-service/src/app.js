const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { errorHandlerMiddleware } = require ('./services/errorHandlingService');
const { logger } = require('./services/loggerService');
const { amqpConnectAndConsume } = require('./services/amqpService');
const { mongoConnect } = require('./services/mongoService');
const { addRoutes } = require('./routes/api');
const { agentSchema } = require('./models/Agent');
const { hashPassword } = require('./lib/tools');


const PORT = process.env.PORT || 4000;

startServer = async () => {
    // Create a new express application instance
    const app = express()

    // Connect to RabbitMQ service  
    amqpConnectAndConsume()

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

    // Init a fake agent
    try {
        const Agent = mongoose.model('Agent', agentSchema);

        const newAgent = new Agent ({
            surname: 'John',
            name: 'Doe',
            password: await hashPassword('password'),
            email: 'john@email.co'
        });
    
        await newAgent.save();
        logger.info('Fake agent is now created agent email : john@email.com , password : password');

    } catch (error) {
        if (error.code === 11000) {
            logger.info('Fake agent is now created agentID email : john@email.com , password : password');
        } else {
            logger.info(error);
        }
    }

    app.listen(PORT, () => {
        logger.info(`agent service listening on port ${PORT}`);
    })
}

module.exports = {
    startServer: startServer
}

