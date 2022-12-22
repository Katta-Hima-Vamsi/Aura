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
function validateEmail(email: string) {
  const re = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
}

/**
 * logsSchema is a Mongoose schema for the logs collection in the pointsLogs database. It has six fields:
 *  - date: A string that represents the date in ISO date format (YYYY-MM-DD). It defaults to the current date.
 *  - time: A string that represents the time in ISO time format (HH:mm:ss). It defaults to the current time.
 *  - teacherEmail: A string that represents the email address of the teacher. It is trimmed, lowercased, and
 *    validated to ensure that it is a valid email address.
 *  - studentName: A string that represents the name of the student.
 *  - pointsAdded: A number that represents the number of points added.
 *  - reason: A string that represents the reason for adding the points.
 */
const logsSchema = new Schema({
  date: {
    type: String,
    default: DateTime.now().setZone(process.env.TIME_ZONE).toISODate(),
  },
  time: {
    type: String,
    default: DateTime.now().setZone(process.env.TIME_ZONE).toISOTime(),
  },
  teacherEmail: {
    type: String,
    trim: true,
    lowercase: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  studentName: { type: String },
  pointsAdded: { type: Number },
  reason: { type: String },
});

/**
 * logsModel is a Mongoose model for the logs collection in the pointsLogs database. It is created using the
 * logsSchema and the 'logs' collection.
 */
export default mongoose.model('logs', logsSchema, 'pointsLogs');
