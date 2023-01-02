const { logger } = require('../services/loggerService');

const hello = (req, res) => {
    res.send('Hello World!');
}

const processReservation = (reservation, reservationChannel) => {
    reservationContent = JSON.parse(reservation.content.toString());
    const delay = Math.floor(Math.random() * 4) + 1;
    setTimeout(delay* 1000, () => {
        reservationChannel.ack(reservation);
        logger.info("AMQP - New reservation received: " + reservationContent + "from the exchange reservations, process in ${delay} seconds");
    });

    // logger.info("AMQP - New reservation received: " + reservationContent + "from the exchange reservations, process in ${delay} seconds");
}

const sayHello = (req, res) => {
    res.send('Hello World!');
}



module.exports = {
    processReservation: processReservation,
    sayHello: sayHello
};