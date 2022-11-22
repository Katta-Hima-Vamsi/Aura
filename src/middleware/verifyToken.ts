// Import the required packages
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Create an auth function
function auth(req: Request, res: Response, next: NextFunction) {
  // Get the token from the header
  const token = req.header('auth-token');
  if (!token) {
    // If there is no token, send a message to the client
    res.status(401).send('Access Denied');
  } else {
    // If there is a token, try and verify the token
    try {
      jwt.verify(token, String(process.env.TOKEN_SECRET));
      next();
    } catch (error) {
      // If there is an error, send a message to the client
      res.status(400).send('Invalid Token');
    }
  }
}

// Export the auth function
export default auth;
