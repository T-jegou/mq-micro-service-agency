const amqp = require('amqplib')
const { logger } = require('./loggerService')
const MQ_HOST = process.env.MQ_HOST || 'localhost';
const MQ_URL = `amqp://${MQ_HOST}:5672`;
const EXCHANGE = 'reservations';
let reservationChannel;

/**
 * Connect to RabbitMQ
 */
const amqpConnect = async () => {
    try {
        const mqConnection = await amqp.connect(MQ_URL);
        reservationChannel = await mqConnection.createChannel();
        
        await reservationChannel.assertExchange(EXCHANGE, 'fanout', {
            durable: false
        });

        logger.info(`AMQP - connection established at ${MQ_URL}`)
        
    }
    catch (ex) {
        logger.log('fatal',`AMQP - ${ex}`);
        process.exit();
    }
}

/**
 * Publish order to queue
 * @param {Object} order - order object containing order details
 */
const publishReservationToExchange = (reservation) => {
    reservationChannel.publish(EXCHANGE,'', Buffer.from(JSON.stringify(reservation)));
    logger.info(`AMQP - New reservation from customer ${reservation.customerID} placed on the exchange`);
}

/**
 * An express middleware for injecting queue services into the request object.
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 * @param {Function} next - express next() function.
 */
const injectExchangeService = (req, res, next) => {
    // Here i can add all exchange operations as methods of exchangeServices object
    const exchangeServices = {
        publishReservationToExchange: publishReservationToExchange
    }
    // inject exchangeServices in request object
    req.exchangeServices = exchangeServices;
    next();
}


module.exports = {
    injectExchangeService: injectExchangeService,
    amqpConnect: amqpConnect
}