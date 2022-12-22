import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import mysql from 'mysql2';

import connectMongoDB from '@src/config/dbConnection';
import rateLimiter from '@src/middleware/rateLimiter';
import validateEnv from '@src/utils/validateEnv';
import points from '@src/routes/points';
import students from '@src/routes/students';
import auth from '@src/routes/auth';
import util from '@src/routes/util';
import sendMail from '@src/config/nodeMailer';

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Create a connection pool for the MySQL database using environment variables
 * for the database host, port, username, password, and database name
 */
const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE_NAME,
  port: Number(process.env.SQL_PORT),
  connectionLimit: 50,
  connectTimeout: 60000,
});

/**
 * Initialize an express server
 */
const app: Application = express();

/**
 * Set the port for the server to listen on
 */
const port: number = Number(process.env.PORT) || 5000;

/**
 * Check that required environment variables are set
 */
validateEnv();

/**
 * Connect to the MongoDB database
 */
connectMongoDB();

/**
 * Set up middleware for the server
 */
app.use(rateLimiter);
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/**
 * Set up an endpoint for the root path '/'
 */
app.get('/', (req: Request, res: Response) => {
  if (Object.keys(req.body).length === 0) {
    res.send('Hello there!');
  } else {
    res.status(400).send(
      "Please do not include anything in your request's body, this endpoint does not require any data "
    );
  }
});

/**
 * Set up endpoints for the '/points', '/students', '/auth', and '/util' paths
 */
app.use('/points', points);
app.use('/students', students);
app.use('/auth', auth);
app.use('/util', util);

/**
 * Listen for the 'open' event on the MongoDB connection
 */
mongoose.connection.once('open', () => {
  /**
   * Query the MySQL database to get the version number
   */
  pool.query('SELECT version()', (err, rows) => {
    if (err) {
      /**
       * If the query fails, send an email using the sendMail function
       * and log the error
       */
      const emailSubject = 'Aura Status Notifier: Database Connection Error';
      const message = `MySQL database connection error on instance ${process.env.INSTANCE_NUMBER}, the server is down. For more information, please check the server's logs.`;
      sendMail(emailSubject, message);
      console.error(err);
    } else {
      /**
       * If the query succeeds, send an email with the version numbers of Node.js, MongoDB, and MySQL
       * and start the server
       */
      const mysqlVersion = JSON.parse(JSON.stringify(rows));
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
      });
    }
  });
});