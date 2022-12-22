import mongoose from 'mongoose';

/**
 * connectMongoDB is a function that connects to a MongoDB database.
 *
 * The connection URI is specified in the `DATABASE_URI` environment variable.
 * If the `DATABASE_URI` variable is not set, an empty string is used as the default value.
 *
 * @returns {void}
 */
const connectMongoDB = async () => {
  mongoose.connect(process.env.DATABASE_URI ?? '', {});
};

export default connectMongoDB;
