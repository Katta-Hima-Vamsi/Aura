import mongoose from 'mongoose';
import { DateTime } from 'luxon';

const { Schema } = mongoose;

/**
 * validateEmail is a function that checks if a given string is a valid email address.
 *
 * @param {string} email - The email string to be validated
 *
 * @returns {boolean} - Returns true if the email is valid, false otherwise
 */
function validateEmail(email) {
  const re = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
}

/**
 * User is a Mongoose schema for the users collection in the database. It has six fields:
 *  - date: A string that represents the date in ISO date format (YYYY-MM-DD). It defaults to the current date.
 *  - time: A string that represents the time in ISO time format (HH:mm:ss). It defaults to the current time.
 *  - name: A string that represents the name of the user. It is required and has a maximum length of 255 characters.
 *  - email: A string that represents the email address of the user. It is required, trimmed, lowercased, and
 *    validated to ensure that it is a valid email address.
 *  - password: A string that represents the password of the user. It is required and has a maximum length of 1024
 *    characters.
 */
const User = new Schema({
  date: {
    type: String,
    default: DateTime.now().setZone(process.env.TIME_ZONE).toISODate(),
  },
  time: {
    type: String,
    default: DateTime.now().setZone(process.env.TIME_ZONE).toISOTime(),
  },
  name: {
    type: String,
    required: true,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
    max: 1024,
  },
});

/**
 * userModel is a Mongoose model for the users collection in the database. It is created using the User schema and
 * the 'users' collection.
 */
export default mongoose.model('User', User, 'users');
