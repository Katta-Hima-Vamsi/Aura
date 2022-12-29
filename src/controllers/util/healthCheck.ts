import { Request, Response } from 'express';
import 'dotenv/config';
import mysql from 'mysql2';

import sendMail from '@src/config/nodeMailer';

/**
 * pool is a connection pool to the MySQL database.
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
 * healthCheck is a function that handles a health check request. It first checks that the request body is empty.
 * It then runs a MySQL query that retrieves the version of the database. If there is an error or the query returns
 * no results, the function sends an email notification to the API manager with the error message and logs the error.
 * If the query is successful, the function sends a status code 200 and the message "OK" to the client.
 *
 * @param {Request} req - The request object contains information about the HTTP request
 * @param {Response} res - The response object contains methods for sending a response to the client
 *
 * @returns {void} - Returns nothing
 */
const healthCheck = (req: Request, res: Response) => {
  if (Object.keys(req.body).length === 0) {
    pool.query('SELECT version()', (err, rows) => {
      if (!rows || err) {
        console.error(err);
        const emailSubject = 'Aura Status Notifier: Database Connection Error';
        const message = `MySQL database connection error on instance ${process.env.INSTANCE_NUMBER}. For more information, please check the server's logs.`;
        sendMail(emailSubject, message);
      } else {
        res.status(200);
        res.send('OK');
        res.end();
      }
    });
  }
};

export default healthCheck;
