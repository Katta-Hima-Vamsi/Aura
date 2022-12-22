import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

/**
 * auth is an async function that acts as middleware to check the validity of an authentication token.
 * It first retrieves the 'auth-token' header from the request, and checks that it is present. If it is
 * not present, it sends a 401 'Access Denied' response to the client. If the token is present, it calls
 * the jsonwebtoken `verify` method to check that it is a valid token. If the token is valid, it calls
 * the `next` function to pass control to the next middleware function. If the token is invalid, it sends
 * a 400 'Invalid Token' response to the client.
 *
 * @param {Request} req - The request object contains information about the HTTP request
 * @param {Response} res - The response object contains methods for sending a response to the client
 * @param {NextFunction} next - The next function is called to pass control to the next middleware function
 *
 * @returns {void} - Returns nothing
 */
function auth(req: Request, res: Response, next: NextFunction) {
  // Retrieve the 'auth-token' header from the request
  const token = req.header('auth-token');
  if (!token) {
    // Token is not present, send 'Access Denied' response
    res.status(401).send('Access Denied');
  } else {
    try {
      // Token is present, verify it using the jsonwebtoken 'verify' method
      jwt.verify(token, String(process.env.TOKEN_SECRET));
      // Token is valid, call the 'next' function to pass control to the next middleware function
      next();
    } catch (error) {
      // Token is invalid, send 'Invalid Token' response
      res.status(400).send('Invalid Token');
    }
  }
}

export default auth;
