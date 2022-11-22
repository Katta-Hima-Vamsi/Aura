// Import the required packages
import mongoose from 'mongoose';
import { DateTime } from 'luxon';

// Get the Schema class from mongoose
const { Schema } = mongoose;

// Create a function to validate the email sent by the client
function validateEmail(email: string) {
  const re = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
}

// Create a new schema for the logs
const logsSchema = new Schema({
  // Create a date field
  date: {
    type: String,
    default: DateTime.now().setZone(process.env.TIME_ZONE).toISODate(),
  },
  // Create a time field
  time: {
    type: String,
    default: DateTime.now().setZone(process.env.TIME_ZONE).toISOTime(),
  },
  // Create a teacherEmail field
  teacherEmail: {
    type: String,
    trim: true,
    lowercase: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  // Create a studentName field
  studentName: { type: String },
  // Create a pointsAdded field
  pointsAdded: { type: Number },
  // Create a reason field
  reason: { type: String },
});

// Export the logsSchema
export default mongoose.model('logs', logsSchema, 'pointsLogs');
