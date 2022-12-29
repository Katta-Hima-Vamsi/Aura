import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import User from '@src/model/user';

/**
 * register is an async function that handles user registration requests.
 *
 * @param {Request} req - The request object contains information about the HTTP request
 * @param {Response} res - The response object contains methods for sending a response to the client
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the user is registered successfully,
 * or rejects with an error if the registration process fails
 */
// eslint-disable-next-line consistent-return
const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send('Please provide the required name, email, and password fields');
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).send(`An account with email ${email} already exists`);
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = new User({ name, email, password: hashPassword });
  try {
    await user.save();
    res.status(201).send('User created successfully');
  } catch (err) {
    res.status(400).send('Unable to process request at this time');
  }
};

export default register;
