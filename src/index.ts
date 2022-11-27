// Import the required packages
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import mysql from 'mysql2';

// Import the required routes, middlewares modules and functions
import connectMongoDB from '@src/config/dbConnection';
import rateLimiter from '@src/middleware/rateLimiter';
import validateEnv from '@src/utils/validateEnv';
import pinger from '@src/utils/pinger';
import points from '@src/routes/points';
import students from '@src/routes/students';
import auth from '@src/routes/auth';
import util from '@src/routes/util';
import sendMail from '@src/config/nodeMailer';

dotenv.config();

// Connect to the MySQL database
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.SQL_PORT),
  connectionLimit: 50,
  connectTimeout: 60000,
});

// Create a new express application instance
// deepcode ignore UseCsurfForExpress: The application does not use cookies
const app: Application = express();
const port: number = Number(process.env.PORT) || 5000;

// Validate the environment variables
validateEnv();

// Connect to the MongoDB database
connectMongoDB();

// Enable the rate limiter
app.use(rateLimiter);

// Enable the helmet middleware
app.use(helmet());

// Enable the express.json middleware
app.use(express.urlencoded({ extended: false }));

// Parse the request body as JSON
app.use(express.json());

// Create the root route
app.get('/', (req: Request, res: Response) => {
  if (Object.keys(req.body).length === 0) {
    res.send('Hello there!');
  } else {
    res
      .status(400)
      .send("Please do not include anything in your request's body, this endpoint does not require any data ");
  }
});

// Assign the routes to the express application instance
app.use('/points', points);
app.use('/students', students);
app.use('/auth', auth);
app.use('/util', util);

// Start the express server
mongoose.connection.once('open', () => {
  pool.query('SELECT version()', (err, rows) => {
    if (err) {
      // Send an email to the admin if the MySQL database connection fails
      const emailSubject = 'Aura Status Notifier: Database Connection Error';
      const message = `MySQL database connection error on instance ${process.env.INSTANCE_NUMBER}, the server is down. For more information, please check the server's logs.`;
      sendMail(emailSubject, message);
      console.error(err);
    } else {
      const mysqlVersion = JSON.parse(JSON.stringify(rows));
      // Send an email to the admin if the server start up is successful
      const emailSubject = 'Aura Status Notifier: Aura is up and running';
      const message =
        `Instance ${
          process.env.INSTANCE_NUMBER
        } started successfully at ${new Date().toString()} with the following versions: \n` +
        `Node.js: ${process.version}\n` +
        `Mongoose: ${mongoose.version}\n` +
        `MySQL: ${mysqlVersion[0]['version()']}`;
      sendMail(emailSubject, message);
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        // Start the pinger function
        pinger();
      });
    }
  });
});
