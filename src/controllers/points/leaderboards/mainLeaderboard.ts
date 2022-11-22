// Import the rqeuired packages
import { Request, Response } from 'express';
import 'dotenv/config';
import mysql from 'mysql2';
import async from 'async';

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

// Create a main leaderboard route
const mainLeaderboard = (req: Request, res: Response) => {
  if (Object.keys(req.body).length === 0) {
    // The 4 queries to get the data for all the houses
    const tigersQuery = `SELECT SUM(points) FROM ${process.env.DATABASE_NAME}.${process.env.TABLENAME} WHERE student_house='tigers';`;
    const tuskersQuery = `SELECT SUM(points) FROM ${process.env.DATABASE_NAME}.${process.env.TABLENAME} WHERE student_house='tuskers';`;
    const whalesQuery = `SELECT SUM(points) FROM ${process.env.DATABASE_NAME}.${process.env.TABLENAME} WHERE student_house='whales';`;
    const hawksQuery = `SELECT SUM(points) FROM ${process.env.DATABASE_NAME}.${process.env.TABLENAME} WHERE student_house='hawks';`;

    // Create an interface for storing the response data
    interface ResponseData {
      tigers?: any;
      tuskers?: any;
      whales?: any;
      hawks?: any;
    }

    const responseData: ResponseData = {};
    // Run all the queries simultaneously
    async.parallel(
      [
        function tigers(parallelDone: any) {
          pool.query(tigersQuery, {}, (err, results) => {
            if (err) return parallelDone(err);
            responseData.tigers = results;
            parallelDone();
          });
        },
        function tuskers(parallelDone: any) {
          pool.query(tuskersQuery, {}, (err, results) => {
            if (err) return parallelDone(err);
            responseData.tuskers = results;
            parallelDone();
          });
        },
        function whales(parallelDone: any) {
          pool.query(whalesQuery, {}, (err, results) => {
            if (err) return parallelDone(err);
            responseData.whales = results;
            parallelDone();
          });
        },
        function hawks(parallelDone: any) {
          pool.query(hawksQuery, {}, (err, results) => {
            if (err) return parallelDone(err);
            responseData.hawks = results;
            parallelDone();
          });
        },
      ],
      // Send an email if there is an error
      (err: any) => {
        if (err) {
          console.error(err);
          res.send('We have an error, please try again later');
          const emailSubject = 'There was an error in the mainLeaderboard.ts controller';
          const message = `An error occurred in the mainLeaderboard.ts controller with MySQL query on instance ${process.env.INSTANCE_NUMBER}, for more information please check the logs`;
          sendMail(emailSubject, message);
        } else {
          // Format the data to be sent to the frontend
          const tigersPointsRaw = responseData.tigers[0]['SUM(points)'];
          const tuskersPointsRaw = responseData.tuskers[0]['SUM(points)'];
          const whalesPointsRaw = responseData.whales[0]['SUM(points)'];
          const hawksPointsRaw = responseData.hawks[0]['SUM(points)'];
          const tigersPointsStr = JSON.stringify(tigersPointsRaw);
          const tuskersPointsStr = JSON.stringify(tuskersPointsRaw);
          const whalesPointsStr = JSON.stringify(whalesPointsRaw);
          const hawksPointsStr = JSON.stringify(hawksPointsRaw);
          const tigersPoints = tigersPointsStr.replace(/\D/g, '');
          const tuskersPoints = tuskersPointsStr.replace(/\D/g, '');
          const whalesPoints = whalesPointsStr.replace(/\D/g, '');
          const hawksPoints = hawksPointsStr.replace(/\D/g, '');
          const resPoints = {
            tigersPoints,
            tuskersPoints,
            whalesPoints,
            hawksPoints,
          };
          // Return the data
          res.status(200).send(resPoints);
        }
      }
    );
  } else {
    // If the request body is not empty, send an error
    res
      .status(400)
      .send(
        "Please do not include anything in your request's body, this endpoint does not require any data, this endpoint does not require any data"
      );
  }
};

// Export the main leaderboard route
export default mainLeaderboard;
