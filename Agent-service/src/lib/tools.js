const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {agentSchema} = require('../models/Agent');
const {carSchema} = require('../models/Car');
const {logger} = require('../services/loggerService');

const Agent = mongoose.model('Agent', agentSchema);

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};


async function validatePassword(password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
};

async function isAgentExistAndPasswordCorrect(agentEmail, password) {
  try {
    let agent = await Agent.findOne({email: agentEmail});
    if (typeof agent === "object") {
      if (await validatePassword(password, agent.password)) {
        return agent;
      } else {
        return false
      }
    } else {
      return false
    }
  } catch (err) {
    return false
  }

};


async function createFakeAgents() {
    try {

        const Agent = mongoose.model('Agent', agentSchema);

        const agent1 = new Agent({
            name: "John",
            surname: "Doe",
            email: "agent1@car.com",
            password: await hashPassword("123456")
        });
        const agent2 = new Agent({
            name: "Jane",
            surname: "Doe",
            email: "agent2@car.com",
            password: await hashPassword("123456")
        });
        const agent3 = new Agent({
            name: "Jean",
            surname: "Doe",
            email: "agent3@car.com",
            password: await hashPassword("123456")
        });
    
        listAgent = [agent1, agent2, agent3];
    
        for (let i = 0; i < listAgent.length; i++) {
            await listAgent[i].save();
        }
    } catch (err) {
        logger.info("If duplicate key, it means that agent already exist ! " + err);
    }
}

async function createFakeCars() {
    try {
        const Car = mongoose.model('Car', carSchema);

        const Car1 = new Car({
            brand: "Audi",
            model: "A3",
            numberOfSeat: 5,
            pricePerDay: 80,
            available: true
        });

        const Car2 = new Car({
            brand: "Bmw",
            model: "M4",
            numberOfSeat: 5,
            pricePerDay: 120,
            available: true
        });

        const Car3 = new Car({
            brand: "Kia",
            model: "Picanto",
            numberOfSeat: 4,
            pricePerDay: 30,
            available: true
        });

        const Car4 = new Car({
            brand: "Renault",
            model: "Master",
            numberOfSeat: 2,
            pricePerDay: 60,
            available: true
        });

        const Car5 = new Car({
            brand: "Peugeot",
            model: "Kangoo",
            numberOfSeat: 3,
            pricePerDay: 45,
            available: true
        });

        const Car6 = new Car({
            brand: "Renault",
            model: "Espace",
            numberOfSeat: 8,
            pricePerDay: 80,
            available: true
        });

        const Car7 = new Car({
            brand: "Renault",
            model: "Scenic",
            numberOfSeat: 7,
            pricePerDay: 75,
            available: true
        });

        const Car8 = new Car({
            brand: "Peugeot",
            model: "306",
            numberOfSeat: 5,
            pricePerDay: 40,
            available: true
        });

        const Car9 = new Car({
            brand: "Audi",
            model: "A1",
            numberOfSeat: 5,
            pricePerDay: 50,
            available: true
        });

        const Car10 = new Car({
            brand: "Audi",
            model: "A7",
            numberOfSeat: 5,
            pricePerDay: 140,
            available: true
        });

        listCars = [Car1, Car2, Car3, Car4, Car5, Car6, Car7, Car8, Car9, Car10];
        for (let i = 0; i < listCars.length; i++) {
            await listCars[i].save();
        }
    } catch (err) {
        logger.info("If duplicate key, it means that car already exist ! " + err);
    }
}

module.exports = {
    isAgentExistAndPasswordCorrect: isAgentExistAndPasswordCorrect, 
    hashPassword: hashPassword,
    validatePassword: validatePassword,
    createFakeAgents: createFakeAgents,
    createFakeCars: createFakeCars
}
