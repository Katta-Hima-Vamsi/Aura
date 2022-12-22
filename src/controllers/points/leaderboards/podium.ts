import { Request, Response } from 'express';
import mysql from 'mysql2';
import sendMail from '@src/config/nodeMailer';

/**
 * createMysqlConnection is a function that creates a new connection pool to the MySQL database.
 *
 * @returns {mysql.Pool} - Returns a connection pool to the MySQL database
 */
const connection = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE_NAME,
  port: Number(process.env.SQL_PORT),
  connectionLimit: 50,
  connectTimeout: 60000,
});

/**
 * podium is an async function that handles requests for the podium leaderboard.
 *
 * @param {Request} req - The request object contains information about the HTTP request
 * @param {Response} res - The response object contains methods for sending a response to the client
 *
 * @returns {void} - Sends a response with the requested data or an error if the process fails
 */
const podium = (req: Request, res: Response) => {
  if (Object.keys(req.body).length > 0) {
    // If the request body is not empty, return a bad request response
    res.status(400).send("Please do not include anything in your request's body, this endpoint does not require any data ");
    return;
  }
  
  // Get the house from the request parameters
  const house = req.params.house;
  
  // Create the MySQL query to get the top 3 students for the given house
  const query = `
    SELECT *
    FROM ${process.env.SQL_DATABASE_NAME}.${process.env.SQL_TABLENAME}
    WHERE student_house = "${house}"
    ORDER BY points DESC
    LIMIT 3;
  `;
  
  // Execute the query and send the response
  connection.query(query, (err, rows) => {
    if (err) {
      // If there was an error executing the query, return a server error response and send an email notification
      res.status(500).send('Internal Server Error');
      const emailSubject = 'There was an error in the podium.ts controller';
      const message = `An error occurred in the podium.ts controller with MySQL query on instance ${process.env.INSTANCE_NUMBER}, for more information please check the logs`;
      sendMail(emailSubject, message);
      console.error(err);
      return;
    }
    
    // If the query was successful, return the rows as the response
    res.status(200).send(rows);
  });
};

export default podium;
