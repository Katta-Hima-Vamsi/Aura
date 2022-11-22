// Import the required packages
import mongoose from 'mongoose';

// Connect to the mongoDB database
const connectMongoDB = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URI ?? '');
  } catch (err) {
    console.error(err);
  }
};

// Export the database connections
export default connectMongoDB;
