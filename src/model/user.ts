// Import the required packages
import mongoose from 'mongoose';
import { DateTime } from 'luxon';

// Get the Schema class from mongoose
const { Schema } = mongoose;

// Validate the email sent by the client
function validateEmail(email: string) {
  const re = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
}

// Create a new schema for the User accounts
const User = new Schema({
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
  // Create a name field
  name: {
    type: String,
    required: true,
    max: 255,
  },
  // Create a email field
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  // Create a password field
  password: {
    type: String,
    required: true,
    max: 1024,
  },
});

// Export the User model
export default mongoose.model('User', User, 'users');
