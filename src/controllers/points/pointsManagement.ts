import { Request, Response } from 'express';
import mysql from 'mysql2';

import createLog from '@src/middleware/logger';
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
 * addPoints is an async function that handles requests to add points to a student's record in the
 * MySQL database. It first checks that the required request parameters (student name, teacher name,
 * points and reason) are present, and that the points are a valid number. It then checks that the
 * points are within the acceptable range (between 1 and the POINTS_LIMIT environment variable).
 * If these checks pass, the function updates the student's record in the MySQL database by adding the
 * specified number of points. Finally, it calls the createLog function to create a log in the MongoDB
 * database and sends a response to the client indicating success. If any errors occur, the function
 * sends an error response to the client and sends an email notification to the API manager.
 *
 * @param {Request} req - The request object contains information about the HTTP request
 * @param {Response} res - The response object contains methods for sending a response to the client
 *
 * @returns {void} - Returns nothing
 */
const addPoints = async (req: Request, res: Response) => {
  const { student, teacher, reason, points } = req.body;

  if (!student || !teacher || !reason || !points) {
    res.status(400).send('Student name, teacher name, points and reason are required');
    return;
  }

  if (Number.isNaN(points)) {
    res.status(400).send('Points should be a number');
    return;
  }

  if (!process.env.POINTS_LIMIT) {
    console.error('Points limit not set');
    process.exitCode = 1;
    return;
  }

  if (points <= 0 || points > process.env.POINTS_LIMIT) {
    res.status(400).send(`Points to add must be between 1 and ${process.env.POINTS_LIMIT}`);
    return;
  }

  const queryString = `
    UPDATE ${process.env.SQL_DATABASE_NAME}.${process.env.SQL_TABLENAME}
    SET points = points + ${points}
    WHERE student_name = "${student}"
  `;

  pool.query(queryString, err => {
    if (err) {
      res.status(500).send('We are unable to process your request at the moment, please try after a few minutes.');
      const emailSubject = 'There was an error in the pointsManagement.ts controller';
      const message = `An error occurred in the pointsManagement.ts controller with MySQL query on instance ${process.env.INSTANCE_NUMBER}, for more information please check the logs.`;
      sendMail(emailSubject, message);
      console.error(err);
      return;
    }

    createLog(teacher, student, points, reason)
      .then(() => res.send('Points added successfully'))
      .catch(error => {
        console.error(error);
        const emailSubject = 'There was an error in the logger.ts middleware';
        const message = `The logger failed to save a log to mongoDB on instance ${process.env.INSTANCE_NUMBER}, for more information please check the logs`;
        sendMail(emailSubject, message);
        res.status(500).send('We are unable to process your request at the moment, please try after a few minutes.');
      });
  });
};

export default addPoints;
