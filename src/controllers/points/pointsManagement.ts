// Import the required packages
import { Request, Response } from 'express';
import 'dotenv/config';
import mysql from 'mysql2';

// Import createLog and sendMail functions
import createLog from '@src/middleware/logger';
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

// Create addPoints function
const addPoints = async (req: Request, res: Response) => {
  // Return error if required information is not provided
  if (!req.body.student || !req.body.teacher || !req.body.reason || !req.body.points) {
    res.status(400).send('Student name, teacher name, points and reason are required');
  } else if (Number.isNaN(req.body.points)) {
    // If the number of points provided in the request body is not a number, return an error
    res.status(400).send('Points should be a number');
  } else if (!process.env.POINTS_LIMIT) {
    // Check for the environment variable, and if it is not set, return an error
    console.error('Points limit not set');
    process.exitCode = 1;
  } else if (
    // If the number of points in the request body is more than the limit or less than 0
    req.body.points <= 0 ||
    req.body.points > process.env.POINTS_LIMIT
  ) {
    res.status(400).send(`Points to add must be between 1 and ${process.env.POINTS_LIMIT}`);
  } else {
    // If all the requirments are met, run the query to add the points to the student
    const queryString =
      `UPDATE ${process.env.DATABASE_NAME}.${process.env.TABLENAME} SET points = points + ${req.body.points} WHERE student_name = ` +
      `"${req.body.student}"`;
    // deepcode ignore Sqli: Not required
    pool.query(queryString, err => {
      // If there is an error, send an email and return an error
      if (err) {
        res.status(500).send('We are unable to process your request at the moment, please try after a few minutes.');
        const emailSubject = 'There was an error in the pointsManagement.ts controller';
        const message = `An error occurred in the pointsManagement.ts controller with MySQL query on instance ${process.env.INSTANCE_NUMBER}, for more information please check the logs.`;
        sendMail(emailSubject, message);
        console.error(err);
      } else {
        // If the query was successful, create a log
        const teacherEmail = req.body.teacher;
        const studentName = req.body.student;
        const pointsAdded = req.body.points;
        const { reason } = req.body;
        createLog(teacherEmail, studentName, pointsAdded, reason)
          .then(err => {
            if (err) {
              // If there was an error, log the error to the console and send a mail to the admin
              const emailSubject = 'There was an error in the logger.ts middleware';
              const message = `The logger failed to save a log to mongoDB on instance ${process.env.INSTANCE_NUMBER}, for more information please check the logs`;
              sendMail(emailSubject, message);
              console.error(err);
              const revertString =
                `UPDATE ${process.env.DATABASE_NAME}.${process.env.TABLENAME} SET points = points - ${req.body.points} WHERE student_name = ` +
                `"${req.body.student}"`;
              // deepcode ignore Sqli: Not required
              pool.query(revertString, err => {
                // If there is an error, send an email and return an error
                if (err) {
                  res
                    .status(500)
                    .send('We are unable to process your request at the moment, please try after a few minutes.');
                  const emailSubject = 'There was an error in the pointsManagement.ts controller';
                  const message = `The logger failed to save a log to mongoDB and the attempt to revert the addition of points has failed on instance ${process.env.INSTANCE_NUMBER}. The details of the addition request are: \n Teacher email: ${teacherEmail}\n Student name: ${studentName}\n Points added: ${pointsAdded}\n Reason: ${reason}\n For more information please check the logs.`;
                  sendMail(emailSubject, message);
                  console.error(err);
                }
              });
            } else {
              // If the log was saved successfully, return a success message
              res.status(201).send('Points added successfully');
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    });
  }
};

// Export the addPoints route
export default addPoints;
