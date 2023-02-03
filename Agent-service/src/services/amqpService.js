const amqp = require("amqplib");
const { processReservation } = require('../controllers/carController');
const { logger } = require('./loggerService');
const {EXCHANGE, QUEUE} = require('../resources/constants');
const PREFETCH_COUNT = parseInt(process.env.PREFETCH_COUNT) || 50;
const MQ_HOST = process.env.MQ_HOST || 'localhost';
const MQ_URL = `amqp://${MQ_HOST}:5672`;
let reservationChannel = null;

/**
 * Connect to RabbitMQ and consumer reversation messages
 */
const amqpConnectAndConsume = async () => {
    try {
        const mqConnection = await amqp.connect(MQ_URL);
        
        reservationChannel = await mqConnection.createChannel();
        
        await reservationChannel.assertExchange(EXCHANGE, 'fanout', {
            durable: false
        });

        // Ensure that the queue exists or create one if it doesn't
        await reservationChannel.assertQueue(QUEUE);
        await reservationChannel.bindQueue(QUEUE, EXCHANGE, '');

        // Only process <PREFETCH_COUNT> reservations at a time
        reservationChannel.prefetch(PREFETCH_COUNT);
        logger.info(`AMQP - connection established at ${MQ_URL} with prefetch count ${PREFETCH_COUNT}`)

        reservationChannel.consume(QUEUE, (reservation) => {
            processReservation(reservation);
        }, { noAck: true });
    }
    catch (ex) {
        logger.log('fatal',`AMQP - ${ex}`);
        process.exit();
    }
}

module.exports = {
    amqpConnectAndConsume: amqpConnectAndConsume
}
