// Import the express package
import express from 'express';

// Import the routes related to authentication
import auth from '@src/middleware/verifyToken';
import register from '@src/controllers/auth/register';
import deleteAcc from '@src/controllers/auth/delete';
import login from '@src/controllers/auth/login';

// Create a new router
const router = express.Router();

// Create a route for the register endpoint
router.post('/login', login);
router.post('/register', auth, register);
router.delete('/delete', auth, deleteAcc);

// Export the router
export default router;
