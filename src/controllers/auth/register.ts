// Import the required packages
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

// Import the user schema
import User from '@src/model/user';

// Create a register route
const register = async (req: Request, res: Response) => {
  // Get the name, email and password from the request body
  if (Object.keys(req.body).length === 0) {
    // Send a 400 response if the request body is empty
    return res.status(400).send('Please provide the required fields');
  }
  if (!req.body.name || !req.body.email || !req.body.password) {
    // Send a 400 response if the request body dosent contain the required fields
    res.status(400).send('Invalid request, please fill in the required fields and try again later.');
  } else {
    // Check if the user already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      // Send a 400 response if the user already exists
      return res
        .status(400)
        .json(`An account with email ${req.body.email} already exists, please try again with a different email.`);
    }
    // If no user is found
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });
    try {
      // Save the user to the database
      await user.save();
    } catch (err) {
      // Send a 400 response if there is an error
      res.status(400).send('We are unable to process your request at this time, please try again later.');
      return;
    }
    // Send a 201 response if the user is created successfully
    res.status(201).send('User created successfully');
    return;
  }
  res.status(500).send('Internal server error');
};

// Export the register route
export default register;
