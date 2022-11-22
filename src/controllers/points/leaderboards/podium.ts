// Import required modules
import { Request, Response } from 'express';
import 'dotenv/config';
import mysql from 'mysql2';

// Import the sendMail function
import sendMail from '@src/config/nodeMailer';

// Connect to the MySQL database
const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.SQL_PORT),
  connectionLimit: 50,
  connectTimeout: 60000,
});

// Create a podium route
const podium = (req: Request, res: Response) => {
  // If the request body is empty, run the query to get the top 3 from the house in the request
  if (Object.keys(req.body).length === 0) {
    const query = `SELECT * FROM ${process.env.DATABASE_NAME}.${process.env.TABLENAME} WHERE student_house="${req.params.house}" ORDER BY points DESC LIMIT 3;`;
    // deepcode ignore Sqli: Not required
    connection.query(query, {}, (err, rows) => {
      if (err) {
        // Send an email if there is an error
        res.status(500).send('Internal Server Error');
        const emailSubject = 'There was an error in the podium.ts controller';
        const message = `An error occurred in the podium.ts controller with MySQL query on instance ${process.env.INSTANCE_NUMBER}, for more information please check the logs`;
        sendMail(emailSubject, message);
        console.log(err);
      } else {
        // Send the response
        return res.status(200).send(rows);
      }
    });
  } else {
    // If the request body is not empty, send an error
    res
      .status(400)
      .send("Please do not include anything in your request's body, this endpoint does not require any data ");
  }
};
// Export the podium route
export default podium;
