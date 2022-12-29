import { Request, Response } from 'express';

import user from '@src/model/user';

/**
 * deleteAcc is an async function that handles the deletion of a user account.
 *
 * @param {Request} req - The request object contains information about the HTTP request
 * @param {Response} res - The response object contains methods for sending a response to the client
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the user account is deleted successfully,
 * or rejects with an error if the user account could not be deleted
 */
// eslint-disable-next-line consistent-return
const deleteAcc = async (req: Request, res: Response) => {
  if (!req.body.email) {
    return res.status(400).send('Please provide the required email field');
  }

  const emailExists = await user.findOne({ email: req.body.email });
  if (!emailExists) {
    return res.status(400).send(`An account with email ${req.body.email} does not exist`);
  }

  try {
    await user.findOneAndDelete({ email: req.body.email });
    res.status(201).send('User deleted successfully');
  } catch (err) {
    res.status(400).send('Unable to process request at this time');
  }
};

export default deleteAcc;
