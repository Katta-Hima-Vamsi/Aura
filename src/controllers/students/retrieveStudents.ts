import { Request, Response } from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import sendMail from '@src/config/nodeMailer';

dotenv.config();

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
 * students is an async function that handles requests to retrieve student information from the MySQL
 * database. It first checks that the request body is empty, as it expects the student's name or ID to
 * be passed as a parameter in the URL. It then runs two MySQL queries: the first searches for students
 * with a name that matches the search parameter, and the second searches for a student with an ID that
 * matches the search parameter. If either query returns any results, it sends those results to the
 * client. If both queries return no results, it sends a 404 response to the client. If any errors
 * occur, the function sends an error response to the client and sends an email notification to the API
 * manager.
 *
 * @param {Request} req - The request object contains information about the HTTP request
 * @param {Response} res - The response object contains methods for sending a response to the client
 *
 * @returns {void} - Returns nothing
 */
const students = async (req: Request, res: Response) => {
  // Ensure that the request body is empty
  if (Object.keys(req.body).length > 0) {
    res.status(400).send('Please do not include anything in your request body');
    return;
  }

  const student = req.params.student;
  // MySQL query to search for students with a name that matches the search parameter
  const queryWithName = `
    SELECT *
    FROM ${process.env.SQL_DATABASE_NAME}.${process.env.SQL_TABLENAME}
    WHERE student_name LIKE '%${student}%';
  `;
  // MySQL query to search for a student with an ID that matches the search parameter
  const queryWithID = `
    SELECT *
    FROM ${process.env.SQL_DATABASE_NAME}.${process.env.SQL_TABLENAME}
    WHERE student_id = "${student}";
  `;

  pool.query(queryWithName, (err, rows) => {
    if (err) {
      res.status(500).send('We are unable to process your request at the moment, please try after a few minutes.');
      const emailSubject = 'There was an error in the retrieveStudents.ts controller';
      const message = `An error occurred in the retrieveStudents.ts controller with MySQL query on instance ${process.env.INSTANCE_NUMBER}, for more information please check the logs`;
      sendMail(emailSubject, message);
      console.error(err);
      return;
    }

    if (Array.isArray(rows) && rows.length > 0) {
      res.status(200).send(rows);
      return;
    }

    pool.query(queryWithID, (error, row) => {
      if (error) {
        res.status(500).send(`We are unable to process your request at the moment, please try after a few minutes. If this issue persists, please check the details entered or email ${process.env.API_MANAGER_EMAIL} regarding the issue.`);
        const emailSubject = 'There was an error in the retrieveStudents.ts controller';
        const message = `An error occurred in the retrieveStudents.ts controller with MySQL query on instance ${process.env.INSTANCE_NUMBER}, for more information please check the logs`;
        sendMail(emailSubject, message);
        console.error(error);
        return;
      }

      if (Array.isArray(row) && row.length > 0) {
        res.status(200).send(row);
      } else {
        res.status(404).json(`We are unable to find any student with the name or ID ${student}`);
      }
    });
  });
};

export default students;

