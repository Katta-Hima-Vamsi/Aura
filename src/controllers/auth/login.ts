import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import userSchema from '@src/model/user';

/**
 * login is an async function that handles user login requests.
 *
 * @param {Request} req - The request object contains information about the HTTP request
 * @param {Response} res - The response object contains methods for sending a response to the client
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the user is logged in successfully,
 * or rejects with an error if the login process fails
 */
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Please provide email and password');
  }

  const user = await userSchema.findOne({ email });
  if (!user) {
    return res.status(400).send('Email or password is incorrect');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send('Email or password is incorrect');
  }

  const token = jwt.sign({ _id: user._id, exp: Math.floor(Date.now() / 1000) + 45 }, String(process.env.TOKEN_SECRET));
  return res.status(201).send({ token });
};

export default login;
