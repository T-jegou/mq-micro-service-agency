const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  adress: {
    type: String
  },
  city: {
    type: String
  },
  zipCode: {
    type: String
  },
  country: {
    type: String
  },
  reservationsID: {
    type: Array
  },
});

module.exports = {
    userSchema: userSchema
} 