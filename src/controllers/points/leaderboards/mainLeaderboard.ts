import { Request, Response } from 'express';
import mysql from 'mysql2';

import sendMail from '@src/config/nodeMailer';

/**
 * LeaderboardResults is an interface that defines the structure of the results object
 * returned by the mainLeaderboard function.
 */
interface LeaderboardResults {
  [key: string]: string;
}

/**
 * createMysqlConnection is a function that creates a new connection pool to the MySQL database.
 *
 * @returns {mysql.Pool} - Returns a connection pool to the MySQL database
 */
const createMysqlConnection = (): mysql.Pool =>
  mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE_NAME,
    port: Number(process.env.SQL_PORT),
    connectionLimit: 50,
    connectTimeout: 60000,
  });

/**
 * mainLeaderboard is an async function that handles main leaderboard requests.
 *
 * @param {Request} req - The request object contains information about the HTTP request
 * @param {Response} res - The response object contains methods for sending a response to the client
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the leaderboard data is retrieved
 * successfully, or rejects with an error if the process fails
 */

const mainLeaderboard = async (req: Request, res: Response): Promise<void> => {
  if (!process.env.HOUSES) {
    console.error('Missing HOUSES environment variable');
  } else {
    const houses = process.env.HOUSES.split(',');
    const results: LeaderboardResults = {};
    const pool = createMysqlConnection();

    switch (Object.keys(req.body).length) {
      case 0:
        houses.forEach(async house => {
          const query = `SELECT SUM(points) FROM ${process.env.SQL_DATABASE_NAME}.${process.env.SQL_TABLENAME} WHERE student_house='${house}'`;
          try {
            const [rows] = await pool.promise().query(query);
            const pointsRaw = rows[0]['SUM(points)'];
            const pointsString = JSON.stringify(pointsRaw);
            const points = pointsString.replace(/\D/g, '');
            results[house] = points;
          } catch (error: any) {
            console.error(`An error occurred while executing MySQL query: ${error.message}`);
            const emailSubject = 'There was an error in the mainLeaderboard.ts controller';
            const message = `An error occurred in the mainLeaderboard.ts controller with MySQL query on instance ${process.env.INSTANCE_NUMBER}, for more information please check the logs`;
            sendMail(emailSubject, message);
            res.status(500).send({
              error: 'An error occurred while retrieving the requested data. Please try again later.',
            });
          }

          const housesLength = Object.keys(results).length;
          if (housesLength === houses.length) {
            res.json(results);
          }
        });
        break;
      default:
        res.status(400).send({
          error: "Please do not include anything in your request's body, this endpoint does not require any data",
        });
    }
  }
};

export default mainLeaderboard;
