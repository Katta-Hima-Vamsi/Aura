// Import the required packages
import { Request, Response } from 'express';
import 'dotenv/config';
import mysql from 'mysql2';

// Import the sendMail function
import sendMail from '@src/config/nodeMailer';

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

// Create a healthCheck route
const healthCheck = (req: Request, res: Response) => {
  // If the request body is empty
  if (Object.keys(req.body).length === 0) {
    // Query to check the health of the MySQL database
    pool.query('SELECT version()', (err, rows) => {
      // If there is an error
      if (!rows || err) {
        // Log the error and send a mail to the admin
        console.error(err);
        const emailSubject = 'Aura Status Notifier: Database Connection Error';
        const message = `MySQL database connection error on instance ${process.env.INSTANCE_NUMBER}. For more information, please check the server's logs.`;
        sendMail(emailSubject, message);
      } else {
        // Send a 200 status code
        res.status(200);
        res.send('OK');
        res.end();
      }
    });
  }
};

export default healthCheck;
