import express from 'express';

// import auth from '@src/middleware/verifyToken';
import register from '@src/controllers/auth/register';
import deleteAcc from '@src/controllers/auth/delete';
import login from '@src/controllers/auth/login';

/**
 * router is an instance of the Express router.
 */
const router = express.Router();

/**
 * login is a route that handles user login requests.
 */
router.post('/login', login);

/**
 * register is a route that handles user registration requests. It requires the request to be authenticated.
 */
router.post('/register', register);

/**
 * deleteAcc is a route that handles delete user requests. It requires the request to be authenticated.
 */
router.delete('/delete', deleteAcc);

export default router;
