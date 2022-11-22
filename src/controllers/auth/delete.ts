// Import the required packages
import { Request, Response } from 'express';

// Import the user schema
import user from '@src/model/user';

// Create a delete route
const deleteAcc = async (req: Request, res: Response) => {
  // Get the name, email and password from the request body
  if (Object.keys(req.body).length === 0) {
    // Send a 400 response if the request body is empty
    return res.status(400).send('Please provide the required fields');
  }
  if (!req.body.email) {
    // Send a 400 response if the request body dosent contain the required fields
    res.status(400).send('Invalid request, please fill in the required fields and try again later.');
  } else {
    // Check if the user exists
    const emailExists = await user.findOne({ email: req.body.email });
    if (!emailExists) {
      // Send a 400 response if the user dosent exist
      return res
        .status(400)
        .json(
          `An account with email ${req.body.email} dose not exist and cannot be deleted, please try again with a different email.`
        );
    }
    // If a user is found
    // Delete the user
    try {
      // Save the user to the database
      await user.findOneAndDelete({ email: req.body.email });
    } catch (err) {
      // Send a 400 response if there is an error
      res.status(400).send('We are unable to process your request at this time, please try again later.');
    }
    // Send a 201 response if the user is deleted
    return res.status(201).send('User deleted successfully');
  }
  return res.status(500).send('Internal server error');
};

// Export the delete route
export default deleteAcc;
