// Import the required packages
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// Import the user schema
import userSchema from '@src/model/user';

// Create a login route
const login = async (req: Request, res: Response) => {
  // Get the email and password from the request body
  if (Object.keys(req.body).length === 0) {
    // Send a 400 response if the request body is empty
    return res.status(400).send('Please provide email and password');
  }
  const user = await userSchema.findOne({ email: req.body.email });
  if (!user) {
    // Send a 400 response if the user is not found
    return res.status(400).send('Email or password is wrong');
  }
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    // Send a 400 response if the password is wrong
    return res.status(400).send('Email or password is wrong');
  }
  const token = jwt.sign(
    // Create a jwt token
    /* eslint no-underscore-dangle: "off" */
    { _id: user._id, exp: Math.floor(Date.now() / 1000) + 45 },
    String(process.env.TOKEN_SECRET)
  );
  // Send a 201 response with the token
  return res.status(201).send({ token });
};

// Export the login route
export default login;
