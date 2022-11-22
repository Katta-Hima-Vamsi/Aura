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

// Create a students route
const students = (req: Request, res: Response) => {
  // If the request body is empty
  if (Object.keys(req.body).length === 0) {
    // Two queries to retrieve the students, one is with their name and  the other is by their id
    const queryStringWithName = `SELECT * FROM ${process.env.DATABASE_NAME}.${process.env.TABLENAME} WHERE student_name LIKE '%${req.params.student}%'`;
    const queryStringWithID = `SELECT * FROM ${process.env.DATABASE_NAME}.${process.env.TABLENAME} WHERE student_id = "${req.params.student}"`;
    // Execute the query which finds the student by their name
    // deepcode ignore Sqli: Not required
    pool.query(queryStringWithName, (err, rows) => {
      if (err) {
        // If there is an error, send a mail to the admin
        const emailSubject = 'There was an error in the retrieveStudents.ts controller';
        const message = `An error occurred in the retrieveStudents.ts controller with MySQL query on instance ${process.env.INSTANCE_NUMBER}, for more information please check the logs`;
        sendMail(emailSubject, message);
        console.error(err);
        res.status(500).send('We are unable to process your request at the moment, please try after a few minutes.');
        // If there are no errors and the query returns a result, send the result to the client
      } else if (Array.isArray(rows) && rows.length > 0) {
        res.status(200).send(rows);
      } else {
        // If the query returns no results, execute the query which finds the student by their id
        // deepcode ignore Sqli: Not required
        pool.query(queryStringWithID, (error, row) => {
          if (error) {
            // If there is an error, send a mail to the admin
            const emailSubject = 'There was an error in the retrieveStudents.ts controller';
            const message = `An error occurred in the retrieveStudents.ts controller with MySQL query on instance ${process.env.INSTANCE_NUMBER}, for more information please check the logs`;
            sendMail(emailSubject, message);
            console.error(error);
            res
              .status(500)
              .send(
                `We are unable to process your request at the moment, please try after a few minutes. If this issue persists, please check the details entered or email ${process.env.API_MANAGER_EMAIL} regarding the issue.`
              );
          } else if (Array.isArray(row) && row.length > 0) {
            // If there are no errors and the query returns a result, send the result to the client
            res.status(200).send(row);
          } else {
            // If both the queries return no results, send a message to the client
            res.status(404).json(`We are unable to find any student with the name or ID ${req.params.student}`);
          }
        });
      }
    });
  } else {
    // If the request body is not empty, send a error to the client
    res.status(400).send('Please do not include anything in your request body');
  }
};

// Export the students route
export default students;
